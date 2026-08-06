package com.auth.repository;

import com.auth.entity.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {

    /**
     * Find the latest active (non-verified, non-expired) OTP for an email.
     */
    Optional<OtpRecord> findTopByEmailAndStatusOrderByCreatedAtDesc(
            String email, String status);

    /**
     * Find all active OTPs for an email (for invalidation on resend).
     */
    List<OtpRecord> findAllByEmailAndStatus(String email, String status);

    /**
     * Delete expired OTP records older than the given timestamp.
     */
    void deleteAllByExpiryTimeBefore(Instant cutoff);
}
