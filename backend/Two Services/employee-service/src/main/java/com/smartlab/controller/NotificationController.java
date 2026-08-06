package com.smartlab.controller;

import com.smartlab.entity.Notification;
import com.smartlab.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false) String role) {
        if (role != null && !role.trim().isEmpty()) {
            return notificationService.getNotificationsByUserIdAndRole(userId, role.trim().toUpperCase());
        }
        return notificationService.getNotificationsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Void> createNotification(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String message = payload.get("message");
        String role = payload.get("role");
        String type = payload.get("type");

        notificationService.broadcastNotification(role, title, message, type);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
