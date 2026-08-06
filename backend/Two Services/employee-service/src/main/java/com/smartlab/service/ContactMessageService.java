package com.smartlab.service;

import com.smartlab.entity.ContactMessage;
import com.smartlab.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository repository;

    public ContactMessageService(ContactMessageRepository repository) {
        this.repository = repository;
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
        return repository.save(msg);
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
