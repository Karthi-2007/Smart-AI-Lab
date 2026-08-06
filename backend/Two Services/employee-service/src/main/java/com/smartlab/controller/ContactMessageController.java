package com.smartlab.controller;

import com.smartlab.entity.ContactMessage;
import com.smartlab.service.ContactMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/contact-messages")
public class ContactMessageController {

    private final ContactMessageService messageService;

    public ContactMessageController(ContactMessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return messageService.getAllMessages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessage> getMessageById(@PathVariable Long id) {
        ContactMessage msg = messageService.getMessageById(id);
        if (msg == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(msg);
    }

    @PostMapping
    public ResponseEntity<ContactMessage> createMessage(@RequestBody ContactMessage msg) {
        ContactMessage saved = messageService.createMessage(msg);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<ContactMessage> sendReply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String replyMessage = body.get("replyMessage");
        if (replyMessage == null || replyMessage.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ContactMessage updated = messageService.sendReply(id, replyMessage);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ContactMessage> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        ContactMessage updated = messageService.updateStatus(id, status != null ? status : "READ");
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
