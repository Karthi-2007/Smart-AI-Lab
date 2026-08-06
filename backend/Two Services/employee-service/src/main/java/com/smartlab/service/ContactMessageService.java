package com.smartlab.service;

import com.smartlab.entity.ContactMessage;
import com.smartlab.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository repository;
    private final NotificationService notificationService;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public ContactMessageService(ContactMessageRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage getMessageById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public ContactMessage createMessage(ContactMessage msg) {
        if (msg.getCreatedAt() == null) {
            msg.setCreatedAt(LocalDateTime.now());
        }
        if (msg.getStatus() == null) {
            msg.setStatus("UNREAD");
        }
        ContactMessage saved = repository.save(msg);

        // Automatically dispatch notification to Admin portal
        try {
            notificationService.createNotification(
                null,
                "ADMIN",
                "New Contact Inquiry: " + (msg.getSubject() != null ? msg.getSubject() : "General Inquiry"),
                "From " + (msg.getName() != null ? msg.getName() : "Visitor") + " (" + (msg.getEmail() != null ? msg.getEmail() : "N/A") + "): " + (msg.getMessage() != null ? msg.getMessage() : ""),
                "CONTACT"
            );
        } catch (Exception e) {
            // Ignore notification failure if any
        }

        return saved;
    }

    public ContactMessage sendReply(Long id, String replyBody) {
        ContactMessage msg = repository.findById(id).orElse(null);
        if (msg == null) return null;

        msg.setStatus("REPLIED");
        ContactMessage updated = repository.save(msg);

        // 1. Send direct email to visitor via JavaMailSender
        if (msg.getEmail() != null && !msg.getEmail().isBlank()) {
            try {
                if (mailSender != null) {
                    SimpleMailMessage email = new SimpleMailMessage();
                    email.setFrom("smartlab.college.auth@gmail.com");
                    email.setTo(msg.getEmail());
                    email.setSubject("Re: " + (msg.getSubject() != null ? msg.getSubject() : "SmartLab AI Inquiry"));
                    email.setText("Dear " + (msg.getName() != null ? msg.getName() : "Visitor") + ",\n\n" +
                            replyBody + "\n\nBest regards,\nSmartLab AI Administration Team\nKathir College of Engineering");
                    mailSender.send(email);
                    System.out.println("--> Successfully sent direct email reply to: " + msg.getEmail());
                } else {
                    System.out.println("--> [Simulated Email] Sent reply to: " + msg.getEmail() + " | Body: " + replyBody);
                }
            } catch (Exception e) {
                System.err.println("--> Could not dispatch email via SMTP (Simulating direct delivery to " + msg.getEmail() + "): " + e.getMessage());
            }
        }

        // 2. Dispatch portal notification feed item
        try {
            notificationService.createNotification(
                null,
                "ALL",
                "Reply to Inquiry: " + (msg.getSubject() != null ? msg.getSubject() : "SmartLab Support"),
                replyBody,
                "INQUIRY_REPLY"
            );
        } catch (Exception e) {
            // Ignore notification failure
        }

        return updated;
    }

    public ContactMessage updateStatus(Long id, String status) {
        ContactMessage msg = repository.findById(id).orElse(null);
        if (msg != null) {
            msg.setStatus(status);
            return repository.save(msg);
        }
        return null;
    }

    public void deleteMessage(Long id) {
        repository.deleteById(id);
    }
}
