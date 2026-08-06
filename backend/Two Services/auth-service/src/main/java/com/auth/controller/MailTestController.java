package com.auth.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class MailTestController {

    private static final Logger log = LoggerFactory.getLogger(MailTestController.class);

    private final JavaMailSender mailSender;

    public MailTestController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Protected by SecurityConfig's hasRole("ADMIN") rule on /api/admin/**
    @PostMapping("/test-mail")
    public ResponseEntity<?> testMail(@RequestParam String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Test Email from Auth Service");
            message.setText("This is a manual SMTP test triggered by an admin.");
            mailSender.send(message);
            log.info("Test email sent to {}", to);
            return ResponseEntity.ok("Test email sent to " + to);
        } catch (Exception ex) {
            log.error("Failed to send test email", ex);
            return ResponseEntity.status(500).body("Failed to send test email. Check mail server config.");
        }
    }
}