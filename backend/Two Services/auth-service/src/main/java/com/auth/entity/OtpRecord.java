package com.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "OTP_RECORDS")
public class OtpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "EMAIL", nullable = false, length = 150)
    private String email;

    @Column(name = "OTP", nullable = false, length = 6)
    private String otp;

    @Column(name = "CREATED_AT", nullable = false)
    private Instant createdAt;

    @Column(name = "EXPIRY_TIME", nullable = false)
    private Instant expiryTime;

    @Column(name = "VERIFIED", nullable = false)
    private boolean verified = false;

    @Column(name = "ATTEMPT_COUNT", nullable = false)
    private int attemptCount = 0;

    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "ACTIVE";

    public OtpRecord() {
    }

    public OtpRecord(String email, String otp, Instant createdAt, Instant expiryTime) {
        this.email = email;
        this.otp = otp;
        this.createdAt = createdAt;
        this.expiryTime = expiryTime;
        this.verified = false;
        this.attemptCount = 0;
        this.status = "ACTIVE";
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getExpiryTime() { return expiryTime; }
    public void setExpiryTime(Instant expiryTime) { this.expiryTime = expiryTime; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
