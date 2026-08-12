package com.smartlab.controller;

import com.smartlab.entity.Notification;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.service.NotificationService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final StudentService studentService;
    private final FacultyService facultyService;

    public NotificationController(NotificationService notificationService,
                                  StudentService studentService,
                                  FacultyService facultyService) {
        this.notificationService = notificationService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false) String role) {
        
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
            
            // Check if requested userId belongs to the authenticated user
            boolean isMatch = principal.getUserId().equals(userId);
            if (!isMatch) {
                if (SecurityUtils.isStudent()) {
                    Student student = studentService.getStudentByUserId(principal.getUserId());
                    if (student == null) {
                        student = studentService.getStudentByEmail(principal.getEmail());
                    }
                    if (student != null && (student.getStudentId().equals(userId) || student.getUserId().equals(userId))) {
                        isMatch = true;
                    }
                } else if (SecurityUtils.isFaculty()) {
                    Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                    if (faculty == null) {
                        faculty = facultyService.getFacultyByEmail(principal.getEmail());
                    }
                    if (faculty != null && (faculty.getFacultyId().equals(userId) || faculty.getUserId().equals(userId))) {
                        isMatch = true;
                    }
                }
            }
            
            if (!isMatch) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                        "You are not authorized to view another user's notifications.");
            }
        }

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
        
        // Enforce owner authorization
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
            if (!principal.getUserId().equals(notification.getUserId())) {
                // Check if it's the student or faculty profile ID mapping
                boolean isMatch = false;
                if (SecurityUtils.isStudent()) {
                    Student student = studentService.getStudentByUserId(principal.getUserId());
                    if (student == null) {
                        student = studentService.getStudentByEmail(principal.getEmail());
                    }
                    if (student != null && (student.getStudentId().equals(notification.getUserId()) || student.getUserId().equals(notification.getUserId()))) {
                        isMatch = true;
                    }
                } else if (SecurityUtils.isFaculty()) {
                    Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                    if (faculty == null) {
                        faculty = facultyService.getFacultyByEmail(principal.getEmail());
                    }
                    if (faculty != null && (faculty.getFacultyId().equals(notification.getUserId()) || faculty.getUserId().equals(notification.getUserId()))) {
                        isMatch = true;
                    }
                }
                
                if (!isMatch) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot modify another user's notification.");
                }
            }
        }
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        Notification notification = notificationService.getNotificationById(id);
        if (notification != null) {
            if (!SecurityUtils.isAdmin()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal == null) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
                }
                if (!principal.getUserId().equals(notification.getUserId())) {
                    boolean isMatch = false;
                    if (SecurityUtils.isStudent()) {
                        Student student = studentService.getStudentByUserId(principal.getUserId());
                        if (student == null) {
                            student = studentService.getStudentByEmail(principal.getEmail());
                        }
                        if (student != null && (student.getStudentId().equals(notification.getUserId()) || student.getUserId().equals(notification.getUserId()))) {
                            isMatch = true;
                        }
                    } else if (SecurityUtils.isFaculty()) {
                        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                        if (faculty == null) {
                            faculty = facultyService.getFacultyByEmail(principal.getEmail());
                        }
                        if (faculty != null && (faculty.getFacultyId().equals(notification.getUserId()) || faculty.getUserId().equals(notification.getUserId()))) {
                            isMatch = true;
                        }
                    }
                    
                    if (!isMatch) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete another user's notification.");
                    }
                }
            }
            notificationService.deleteNotification(id);
        }
        return ResponseEntity.noContent().build();
    }
}
