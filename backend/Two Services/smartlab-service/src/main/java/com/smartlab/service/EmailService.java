package com.smartlab.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String toEmail, String subject, String htmlContent) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            log.warn("Skipping email: recipient address is empty");
            return;
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            if (fromEmail != null && !fromEmail.trim().isEmpty()) {
                helper.setFrom(fromEmail);
            }
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            log.info("Sending email to {} with subject: {}", toEmail, subject);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    public String buildTemplate(String title, String heading, String description, String detailsHtml) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa; color: #333; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e8ed; }
                    .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #ffffff; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                    .content { padding: 30px; line-height: 1.6; }
                    .content h2 { color: #1e3a8a; margin-top: 0; }
                    .details-table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
                    .details-table td { padding: 10px; border-bottom: 1px solid #edf2f7; }
                    .details-table td.label { font-weight: bold; color: #4a5568; width: 30%%; }
                    .details-table td.value { color: #2d3748; }
                    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔬 SmartLab AI</h1>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        <table class="details-table">
                            %s
                        </table>
                    </div>
                    <div class="footer">
                        This is an automated notification from SmartLab AI. Please do not reply directly.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(heading, description, detailsHtml);
    }
}
