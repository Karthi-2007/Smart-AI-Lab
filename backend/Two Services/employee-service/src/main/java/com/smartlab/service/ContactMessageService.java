package com.smartlab.service;

import com.smartlab.entity.ContactMessage;
import com.smartlab.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository repository;
    private final NotificationService notificationService;

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
