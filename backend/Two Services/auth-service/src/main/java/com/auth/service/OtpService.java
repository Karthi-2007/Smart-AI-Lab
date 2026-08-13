package com.auth.service;

import com.auth.entity.OtpRecord;
import com.auth.exception.*;
import com.auth.repository.OtpRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OtpService {

    private static final Logger log =
            LoggerFactory.getLogger(OtpService.class);

    private static final String STATUS_ACTIVE  = "ACTIVE";
    private static final String STATUS_USED    = "USED";
    private static final String STATUS_EXPIRED = "EXPIRED";
    private static final int    MAX_ATTEMPTS   = 5;

    @Value("${otp.expiry.minutes:5}")
    private long otpExpiryMinutes;

    @Value("${otp.resend.cooldown.seconds:60}")
    private long resendCooldownSeconds;

    private final OtpRecordRepository otpRecordRepository;
    private final EmailService emailService;
    private final TelegramService telegramService;
    private final com.auth.repository.AppUserRepository appUserRepository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public OtpService(OtpRecordRepository otpRecordRepository,
                      EmailService emailService,
                      TelegramService telegramService,
                      com.auth.repository.AppUserRepository appUserRepository) {
        this.otpRecordRepository = otpRecordRepository;
        this.emailService = emailService;
        this.telegramService = telegramService;
        this.appUserRepository = appUserRepository;
    }

    private String getUserPhone(String email, com.auth.entity.Role role) {
        try {
            if (role == com.auth.entity.Role.STUDENT) {
                return (String) entityManager.createNativeQuery(
                    "SELECT phone FROM smartlab.student_profiles WHERE email = :email"
                ).setParameter("email", email).getSingleResult();
            } else if (role == com.auth.entity.Role.FACULTY) {
                return (String) entityManager.createNativeQuery(
                    "SELECT phone FROM smartlab.faculty_profiles WHERE email = :email"
                ).setParameter("email", email).getSingleResult();
            }
        } catch (Exception e) {
            log.warn("Could not find phone number for {} in smartlab profiles: {}", email, e.getMessage());
        }
        return null;
    }

    @Transactional
    public void generateAndSendOtp(String email) {
        invalidateAllActive(email);

        String otp = generateSixDigitOtp();
        Instant now = Instant.now();
        Instant expiry = now.plus(otpExpiryMinutes, ChronoUnit.MINUTES);

        OtpRecord record = new OtpRecord(email, otp, now, expiry);
        otpRecordRepository.save(record);

        log.info("OTP generated and persisted for {} -> [{}]", email, otp);

        try {
            emailService.sendOtpEmail(email, otp);
            log.info("REAL EMAIL SUCCESSFULLY SENT TO {}", email);
        } catch (Exception e) {
            log.warn("SMTP email dispatch failed: [{}]. Generated OTP for [{}] is: [{}]", e.toString(), email, otp);
        }

        try {
            telegramService.sendTelegramMessage("🔐 <b>SmartLab AI OTP Alert</b>\nUser: " + email + "\nYour OTP for password reset is: <code>" + otp + "</code>\nValid for 5 minutes.");
        } catch (Exception e) {
            log.warn("Telegram OTP dispatch failed: {}", e.toString());
        }
    }

    @Transactional
    public void resendOtp(String email) {
        otpRecordRepository
            .findTopByEmailAndStatusOrderByCreatedAtDesc(email, STATUS_ACTIVE)
            .ifPresent(existing -> {
                long secondsSinceCreation = ChronoUnit.SECONDS.between(
                        existing.getCreatedAt(), Instant.now());

                if (secondsSinceCreation < resendCooldownSeconds) {
                    long waitSeconds = resendCooldownSeconds - secondsSinceCreation;
                    throw new OtpResendTooSoonException(
                        "Please wait " + waitSeconds + " seconds before requesting a new OTP.");
                }
            });

        generateAndSendOtp(email);
    }

    @Transactional
    public void validateOtp(String email, String otp) {
        OtpRecord record = otpRecordRepository
            .findTopByEmailAndStatusOrderByCreatedAtDesc(email, STATUS_ACTIVE)
            .orElseThrow(() ->
                new InvalidOtpException("No active OTP found. Please request a new one."));

        if (Instant.now().isAfter(record.getExpiryTime())) {
            record.setStatus(STATUS_EXPIRED);
            otpRecordRepository.save(record);
            throw new OtpExpiredException(
                "OTP has expired. Please request a new one.");
        }

        if (record.getAttemptCount() >= MAX_ATTEMPTS) {
            record.setStatus(STATUS_EXPIRED);
            otpRecordRepository.save(record);
            throw new TooManyAttemptsException(
                "Too many incorrect attempts. Please request a new OTP.");
        }

        if (!record.getOtp().equals(otp)) {
            record.setAttemptCount(record.getAttemptCount() + 1);
            otpRecordRepository.save(record);
            int remaining = MAX_ATTEMPTS - record.getAttemptCount();
            throw new InvalidOtpException(
                "Invalid OTP. " + remaining + " attempt(s) remaining.");
        }

        record.setVerified(true);
        record.setStatus(STATUS_USED);
        otpRecordRepository.save(record);

        log.info("OTP verified successfully for {}", email);
    }

    public boolean isOtpVerified(String email) {
        return otpRecordRepository
            .findTopByEmailAndStatusOrderByCreatedAtDesc(email, STATUS_USED)
            .map(r -> Instant.now().isBefore(
                    r.getExpiryTime().plus(5, ChronoUnit.MINUTES)))
            .orElse(false);
    }

    @Transactional
    public void invalidateAfterReset(String email) {
        invalidateAllActive(email);
        otpRecordRepository
            .findTopByEmailAndStatusOrderByCreatedAtDesc(email, STATUS_USED)
            .ifPresent(r -> {
                r.setStatus(STATUS_EXPIRED);
                otpRecordRepository.save(r);
            });
    }

    @Scheduled(fixedRateString = "${otp.cleanup.interval.ms:1800000}")
    @Transactional
    public void cleanupExpired() {
        Instant cutoff = Instant.now().minus(1, ChronoUnit.HOURS);
        otpRecordRepository.deleteAllByExpiryTimeBefore(cutoff);
        log.debug("Cleaned up expired OTP records older than 1 hour");
    }

    private String generateSixDigitOtp() {
        return String.format("%06d",
                ThreadLocalRandom.current().nextInt(100000, 999999));
    }

    private void invalidateAllActive(String email) {
        List<OtpRecord> active =
                otpRecordRepository.findAllByEmailAndStatus(email, STATUS_ACTIVE);
        active.forEach(r -> r.setStatus(STATUS_EXPIRED));
        otpRecordRepository.saveAll(active);
    }
}