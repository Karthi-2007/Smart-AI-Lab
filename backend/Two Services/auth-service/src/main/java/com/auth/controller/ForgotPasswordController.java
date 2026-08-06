package com.auth.controller;

import com.auth.dto.ApiResponse;
import com.auth.dto.ForgotPasswordRequest;
import com.auth.dto.ResetPasswordRequest;
import com.auth.dto.VerifyOtpRequest;
import com.auth.entity.AppUser;
import com.auth.exception.EmailNotRegisteredException;
import com.auth.exception.InvalidOtpException;
import com.auth.repository.AppUserRepository;
import com.auth.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Forgot Password flow:
 *   1. POST /api/auth/forgot-password/request-otp → generate & email OTP
 *   2. POST /api/auth/forgot-password/verify-otp  → validate OTP
 *   3. POST /api/auth/forgot-password/reset       → set new password (requires verified OTP)
 *   4. POST /api/auth/forgot-password/resend-otp  → request a new OTP (60-second cooldown)
 */
@RestController
@RequestMapping("/api/auth/forgot-password")
@Tag(name = "Forgot Password", description = "OTP-based password reset endpoints")
public class ForgotPasswordController {

    private static final Logger log =
            LoggerFactory.getLogger(ForgotPasswordController.class);

    private final AppUserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordController(AppUserRepository userRepository,
                                    OtpService otpService,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
    }


    // =============================================
    // 1. Forgot Password — generate and email OTP
    // =============================================

    @Operation(summary = "Request OTP for password reset",
               description = "Generates a 6-digit OTP valid for 5 minutes and sends it to the user's registered email.")
    @PostMapping("/request-otp")
    public ResponseEntity<ApiResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest req) {

        String email = normalize(req.getEmail());

        // Verify email exists in the system
        if (!userRepository.existsByEmail(email)) {
            throw new EmailNotRegisteredException(
                "No account found with email: " + email);
        }

        // Verify account is active
        AppUser user = userRepository.findByEmail(email).orElseThrow();
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new EmailNotRegisteredException(
                "Account is not yet activated. Please complete registration first.");
        }

        otpService.generateAndSendOtp(email);

        log.info("Forgot-password OTP dispatched for {}", email);

        return ResponseEntity.ok(
            ApiResponse.success("OTP sent successfully. Please check your email."));
    }


    // =============================================
    // 2. Verify OTP
    // =============================================

    @Operation(summary = "Verify OTP for password reset",
               description = "Validates the 6-digit OTP submitted by the user.")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest req) {

        String email = normalize(req.getEmail());

        if (!userRepository.existsByEmail(email)) {
            throw new EmailNotRegisteredException(
                "No account found with email: " + email);
        }

        otpService.validateOtp(email, req.getOtp());

        return ResponseEntity.ok(
            ApiResponse.success("OTP verified successfully. You may now reset your password."));
    }


    // =============================================
    // 3. Reset Password
    // =============================================

    @Operation(summary = "Reset password",
               description = "Sets a new BCrypt-encoded password. Only succeeds if OTP was verified first.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest req) {

        String email = normalize(req.getEmail());

        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new EmailNotRegisteredException(
                    "No account found with email: " + email));

        if (!otpService.isOtpVerified(email)) {
            throw new InvalidOtpException(
                "OTP not verified. Please verify your OTP before resetting the password.");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        otpService.invalidateAfterReset(email);

        log.info("Password reset successfully for {}", email);

        return ResponseEntity.ok(
            ApiResponse.success("Password reset successfully. You may now log in."));
    }


    // =============================================
    // 4. Resend OTP (60-second cooldown enforced)
    // =============================================

    @Operation(summary = "Resend OTP for password reset",
               description = "Sends a new OTP, invalidating any previous one.")
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendOtp(
            @Valid @RequestBody ForgotPasswordRequest req) {

        String email = normalize(req.getEmail());

        if (!userRepository.existsByEmail(email)) {
            throw new EmailNotRegisteredException(
                "No account found with email: " + email);
        }

        otpService.resendOtp(email);

        log.info("OTP resent for {}", email);

        return ResponseEntity.ok(
            ApiResponse.success("New OTP sent successfully. Please check your email."));
    }


    private String normalize(String email) {
        return email == null ? null : email.toLowerCase().trim();
    }
}
