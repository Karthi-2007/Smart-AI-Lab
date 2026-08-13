package com.smartlab.service;

import com.smartlab.entity.Faculty;
import com.smartlab.entity.Notification;
import com.smartlab.entity.Student;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.repository.NotificationRepository;
import com.smartlab.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               StudentRepository studentRepository,
                               FacultyRepository facultyRepository) {
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
    }

    public List<Notification> getNotificationsByUserIdAndRole(Long userId, String userRole) {
        return notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(userId, userRole);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public Notification createNotification(Long userId, String title, String message, String type) {
        Notification notification = new Notification(userId, "STUDENT", title, message, type);
        return notificationRepository.save(notification);
    }

    public Notification createNotification(Long userId, String userRole, String title, String message, String type) {
        Notification notification = new Notification(userId, userRole, title, message, type);
        return notificationRepository.save(notification);
    }

    public void broadcastNotification(String role, String title, String message, String type) {
        String targetRole = (role != null && !role.trim().isEmpty()) ? role.trim().toUpperCase() : "ALL";
        String notifType = (type != null && !type.trim().isEmpty()) ? type : "SYSTEM";

        if ("ALL".equals(targetRole) || "STUDENT".equals(targetRole)) {
            List<Student> students = studentRepository.findAll();
            for (Student s : students) {
                Long targetId = s.getUserId() != null ? s.getUserId() : s.getStudentId();
                if (targetId != null) {
                    notificationRepository.save(new Notification(targetId, "STUDENT", title, message, notifType));
                }
                if (s.getStudentId() != null && !s.getStudentId().equals(targetId)) {
                    notificationRepository.save(new Notification(s.getStudentId(), "STUDENT", title, message, notifType));
                }
            }
        }

        if ("ALL".equals(targetRole) || "FACULTY".equals(targetRole)) {
            List<Faculty> faculties = facultyRepository.findAll();
            for (Faculty f : faculties) {
                Long targetId = f.getUserId() != null ? f.getUserId() : f.getFacultyId();
                if (targetId != null) {
                    notificationRepository.save(new Notification(targetId, "FACULTY", title, message, notifType));
                }
                if (f.getFacultyId() != null && !f.getFacultyId().equals(targetId)) {
                    notificationRepository.save(new Notification(f.getFacultyId(), "FACULTY", title, message, notifType));
                }
            }
        }
    }
}
