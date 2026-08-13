package com.auth.controller;

import java.util.Map;
import java.util.Optional;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.auth.dto.FacultyRegisterRequest;
import com.auth.dto.LoginRequest;
import com.auth.dto.OtpVerificationRequest;
import com.auth.dto.ResendOtpRequest;
import com.auth.dto.StudentRegisterRequest;
import com.auth.entity.AppUser;
import com.auth.repository.AppUserRepository;
import com.auth.security.JwtUtil;
import com.auth.service.OtpService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final com.auth.service.UserSyncService userSyncService;

    public AuthController(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            OtpService otpService,
            com.auth.service.UserSyncService userSyncService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.userSyncService = userSyncService;
    }

    private String normalize(String email) {
        return email == null ? null : email.toLowerCase().trim();
    }

    // ===============================
    // STUDENT REGISTER
    // ===============================

    @PostMapping("/student/register")
    public ResponseEntity<?> studentRegister(
            @Valid @RequestBody StudentRegisterRequest req
    ) {
        String email = normalize(req.getEmail());

        Optional<AppUser> optional =
                appUserRepository.findByRegNoAndEmailAndDob(
                        req.getRegNo(),
                        email,
                        req.getDob()
                );

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Student record not found");
        }

        AppUser user = optional.get();

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.badRequest().body("Account already activated");
        }

        user.setStatus("PENDING");
        appUserRepository.save(user);

        try {
            otpService.generateAndSendOtp(email);
        } catch (Exception e) {
            log.error("Failed to send OTP to {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP email: " + e.getMessage());
        }

        return ResponseEntity.ok("OTP sent successfully");
    }

    // ===============================
    // FACULTY REGISTER
    // ===============================

    @PostMapping("/faculty/register")
    public ResponseEntity<?> facultyRegister(
            @Valid @RequestBody FacultyRegisterRequest req
    ) {
        String email = normalize(req.getEmail());

        Optional<AppUser> optional =
                appUserRepository.findByFacultyIdAndEmailAndDob(
                        req.getFacultyId(),
                        email,
                        req.getDob()
                );

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Faculty record not found");
        }

        AppUser user = optional.get();

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.badRequest().body("Account already activated");
        }

        user.setStatus("PENDING");
        appUserRepository.save(user);

        try {
            otpService.generateAndSendOtp(email);
        } catch (Exception e) {
            log.error("Failed to send OTP to {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send OTP email: " + e.getMessage());
        }

        return ResponseEntity.ok("OTP sent successfully");
    }

    // ===============================
    // RESEND OTP
    // ===============================

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(
            @Valid @RequestBody ResendOtpRequest req
    ) {
        String email = normalize(req.getEmail());

        Optional<AppUser> optional = appUserRepository.findByEmail(email);

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        AppUser user = optional.get();

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.badRequest().body("Account already active");
        }

        try {
            otpService.resendOtp(email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok("OTP resent successfully");
    }

    // ===============================
    // VERIFY OTP + SET PASSWORD
    // ===============================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody OtpVerificationRequest req
    ) {
        String email = normalize(req.getEmail());

        try {
            otpService.validateOtp(email, req.getOtp());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        Optional<AppUser> optional = appUserRepository.findByEmail(email);

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        AppUser user = optional.get();

        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        }

        user.setStatus("ACTIVE");
        AppUser savedUser = appUserRepository.save(user);

        // Sync with smartlab-service
        userSyncService.syncUser(savedUser);

        return ResponseEntity.ok("Password created and account activated successfully");
    }

    // ===============================
    // LOGIN
    // ===============================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest req
    ) {
        String email = normalize(req.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            req.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is not activated");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        }

        AppUser user = appUserRepository.findByEmail(email).orElseThrow();

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Complete account activation first");
        }

        String role = user.getRole() != null ? user.getRole().name() : "STUDENT";

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getUserId(),
                role
        );

        String regNo = user.getRegNo() != null ? user.getRegNo() : "";

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", role,
                        "userId", user.getUserId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "regNo", regNo
                )
        );
    }

    // ===============================
    // CHANGE PASSWORD (Authenticated)
    // ===============================

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> req
    ) {
        String email = normalize(req.get("email"));
        String currentPassword = req.get("currentPassword");
        String newPassword = req.get("newPassword");

        if (email == null || currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("email, currentPassword and newPassword are required");
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("New password must be at least 6 characters");
        }

        Optional<AppUser> optional = appUserRepository.findByEmail(email);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        AppUser user = optional.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        appUserRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    // ===============================
    // UPDATE PROFILE (Authenticated)
    // ===============================
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> req) {
        String currentEmail = normalize(req.get("currentEmail"));
        String newEmail = normalize(req.get("newEmail"));
        String name = req.get("name");

        if (currentEmail == null || newEmail == null || name == null) {
            return ResponseEntity.badRequest().body("currentEmail, newEmail and name are required");
        }

        Optional<AppUser> optional = appUserRepository.findByEmail(currentEmail);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        AppUser user = optional.get();

        if (!currentEmail.equalsIgnoreCase(newEmail)) {
            Optional<AppUser> collision = appUserRepository.findByEmail(newEmail);
            if (collision.isPresent()) {
                return ResponseEntity.badRequest().body("Email address is already in use by another account");
            }
            user.setEmail(newEmail);
        }

        user.setName(name);
        AppUser savedUser = appUserRepository.save(user);

        // Sync with smartlab-service
        try {
            userSyncService.syncUser(savedUser);
        } catch (Exception e) {
            log.error("Failed to sync updated user profiles: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
            "name", savedUser.getName(),
            "email", savedUser.getEmail()
        ));
    }

    // ===============================
    // LOGOUT
    // ===============================

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}