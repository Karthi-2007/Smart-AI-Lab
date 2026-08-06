package com.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Objects;

/**
 * Production-ready email service using Gmail SMTP with TLS.
 * Sends OTP emails with a professional HTML template.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Override
    public void sendOtpEmail(String toEmail, String otp) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (fromEmail != null) {
                helper.setFrom(fromEmail);
            }
            if (toEmail != null) {
                helper.setTo(toEmail);
            }
            String safeOtp = otp != null ? otp : "";
            helper.setSubject("SmartLab AI - Your OTP for Account Activation");
            helper.setText(Objects.requireNonNull(buildOtpEmailBody(safeOtp), "Email body must not be null"), true);

            log.info("Attempting to send OTP email to {} from {}", toEmail, fromEmail);
            mailSender.send(mimeMessage);
            log.info("OTP email sent successfully to {}", toEmail);

        } catch (MessagingException e) {
            log.error("MessagingException sending OTP to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP email. Please try again later.");
        } catch (Exception e) {
            log.error("Unexpected error sending OTP to {} | Cause: {} | Root: {}",
                    toEmail, e.getMessage(),
                    e.getCause() != null ? e.getCause().getMessage() : "none", e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }


    /**
     * Builds a professional HTML email template for OTP delivery.
     */
    private String buildOtpEmailBody(String otp) {

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:#f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding:32px 40px; text-align:center;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:600; letter-spacing:0.5px;">
                                🔬 SmartLab AI
                            </h1>
                            <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">
                                Smart Laboratory Equipment Booking Platform
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px;">
                            <p style="color:#333333; font-size:16px; margin:0 0 20px; line-height:1.6;">
                                Hello,
                            </p>
                            <p style="color:#333333; font-size:16px; margin:0 0 24px; line-height:1.6;">
                                Your One-Time Password (OTP) for resetting your SmartLab AI account password is:
                            </p>

                            <!-- OTP Box -->
                            <div style="text-align:center; margin:32px 0;">
                                <div style="display:inline-block; background:linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); border-radius:12px; padding:20px 48px;">
                                    <span style="font-size:36px; font-weight:700; letter-spacing:12px; color:#ffffff; font-family: 'Courier New', monospace;">
                                        %s
                                    </span>
                                </div>
                            </div>

                            <!-- Warning -->
                            <div style="background-color:#fff8e1; border-left:4px solid #ffc107; border-radius:4px; padding:16px 20px; margin:24px 0;">
                                <p style="color:#856404; font-size:14px; margin:0; line-height:1.5;">
                                    ⏱ This OTP is valid for <strong>5 minutes</strong> only.
                                </p>
                            </div>

                            <p style="color:#555555; font-size:14px; margin:20px 0 0; line-height:1.6;">
                                Do not share this OTP with anyone. SmartLab AI will never ask you for your OTP via phone or message.
                            </p>

                            <p style="color:#555555; font-size:14px; margin:16px 0 0; line-height:1.6;">
                                If you did not request this password reset, please ignore this email. Your account is safe.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8f9fa; padding:24px 40px; text-align:center; border-top:1px solid #e9ecef;">
                            <p style="color:#999999; font-size:12px; margin:0; line-height:1.5;">
                                This is an automated email from SmartLab AI.<br>
                                Please do not reply to this email.
                            </p>
                            <p style="color:#bbbbbb; font-size:11px; margin:12px 0 0;">
                                © 2026 SmartLab AI Team. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(otp);
    }
}
