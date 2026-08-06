package com.auth.service;

/**
 * Email service interface for sending OTP emails.
 * Abstracted to allow easy swapping of email providers.
 */
public interface EmailService {

    /**
     * Send an OTP email to the specified recipient.
     *
     * @param toEmail the recipient's email address
     * @param otp     the 6-digit OTP
     */
    void sendOtpEmail(String toEmail, String otp);
}
