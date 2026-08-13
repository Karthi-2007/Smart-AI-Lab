package com.smartlab.controller;

import com.smartlab.entity.Notification;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.service.NotificationService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.repository.NotificationRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final StudentService studentService;
    private final FacultyService facultyService;

    public NotificationController(NotificationService notificationService,
                                  NotificationRepository notificationRepository,
                                  StudentService studentService,
                                  FacultyService facultyService) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<?> getAllNotifications() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only admins can query all notifications globally."));
        }
        List<Notification> list = notificationService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("All notifications retrieved", list));
    }

    @GetMapping({"/user/{userId}", "/user/{userId}/notifications-list"})
    public ResponseEntity<?> getNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false) String role) {
        
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
            }
            
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
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You are not authorized to view another user's notifications."));
            }
        }

        List<Notification> list;
        if (role != null && !role.trim().isEmpty()) {
            list = notificationService.getNotificationsByUserIdAndRole(userId, role.trim().toUpperCase());
        } else {
            list = notificationService.getNotificationsByUserId(userId);
        }
        return ResponseEntity.ok(ApiResponse.success("Notifications loaded successfully", list));
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        List<Notification> list = notificationRepository.findAll((root, query, cb) -> 
            cb.and(
                cb.equal(root.get("userId"), principal.getUserId()),
                cb.equal(root.get("isRead"), false)
            )
        );
        return ResponseEntity.ok(ApiResponse.success("Unread notifications loaded", list));
    }

    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        long count = notificationRepository.findAll((root, query, cb) -> 
            cb.and(
                cb.equal(root.get("userId"), principal.getUserId()),
                cb.equal(root.get("isRead"), false)
            )
        ).size();
        
        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        return ResponseEntity.ok(ApiResponse.success("Unread count loaded", data));
    }

    // ── Dedicated GET Endpoints for User Notifications Tabs ───────
    @GetMapping("/all")
    public ResponseEntity<?> getMyNotificationsAll() {
        return fetchMyNotificationsByType(null);
    }

    @GetMapping("/booking")
    public ResponseEntity<?> getMyNotificationsBooking() {
        return fetchMyNotificationsByType("Booking");
    }

    @GetMapping("/equipment")
    public ResponseEntity<?> getMyNotificationsEquipment() {
        return fetchMyNotificationsByType("Equipment");
    }

    @GetMapping("/maintenance")
    public ResponseEntity<?> getMyNotificationsMaintenance() {
        return fetchMyNotificationsByType("Maintenance");
    }

    // ── Dedicated GET Endpoints for Admin System Notification Tabs 
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAdminNotificationsAll() {
        return fetchAdminNotifications("ALL");
    }

    @GetMapping("/admin/unread")
    public ResponseEntity<?> getAdminNotificationsUnread() {
        return fetchAdminNotifications("UNREAD");
    }

    @GetMapping("/admin/booking")
    public ResponseEntity<?> getAdminNotificationsBooking() {
        return fetchAdminNotifications("BOOKING");
    }

    @GetMapping("/admin/system")
    public ResponseEntity<?> getAdminNotificationsSystem() {
        return fetchAdminNotifications("SYSTEM");
    }

    @GetMapping("/admin/fault")
    public ResponseEntity<?> getAdminNotificationsFault() {
        return fetchAdminNotifications("FAULT");
    }

    @GetMapping("/admin/maintenance")
    public ResponseEntity<?> getAdminNotificationsMaintenance() {
        return fetchAdminNotifications("MAINTENANCE");
    }

    private ResponseEntity<?> fetchAdminNotifications(String filter) {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only admins can query system notifications."));
        }

        List<Notification> list = notificationRepository.findAll((root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if ("UNREAD".equalsIgnoreCase(filter)) {
                predicates.add(cb.equal(root.get("isRead"), false));
            } else if (filter != null && !"ALL".equalsIgnoreCase(filter)) {
                predicates.add(cb.equal(cb.lower(root.get("type")), filter.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        });

        return ResponseEntity.ok(ApiResponse.success("Admin notifications loaded (" + filter + ")", list));
    }

    private ResponseEntity<?> fetchMyNotificationsByType(String type) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        List<Long> candidateIds = getCandidateUserIds();
        List<Notification> list = notificationRepository.findAll((root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(root.get("userId").in(candidateIds));
            if (type != null && !type.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("type")), type.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        });

        return ResponseEntity.ok(ApiResponse.success("Notifications loaded (" + (type != null ? type : "All") + ")", list));
    }

    private List<Long> getCandidateUserIds() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        List<Long> ids = new ArrayList<>();
        if (principal != null) {
            ids.add(principal.getUserId());
            try {
                if (SecurityUtils.isFaculty()) {
                    Faculty f = facultyService.getFacultyByUserId(principal.getUserId());
                    if (f == null) f = facultyService.getFacultyByEmail(principal.getEmail());
                    if (f != null && f.getFacultyId() != null && !ids.contains(f.getFacultyId())) {
                        ids.add(f.getFacultyId());
                    }
                } else if (SecurityUtils.isStudent()) {
                    Student s = studentService.getStudentByUserId(principal.getUserId());
                    if (s == null) s = studentService.getStudentByEmail(principal.getEmail());
                    if (s != null && s.getStudentId() != null && !ids.contains(s.getStudentId())) {
                        ids.add(s.getStudentId());
                    }
                }
            } catch (Exception ignored) {}
        }
        return ids;
    }

    @RequestMapping(value = "/read-all", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<?> readAllNotifications() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        List<Long> targetIds = getCandidateUserIds();
        List<Notification> unread = notificationRepository.findAll((root, query, cb) -> 
            cb.and(
                root.get("userId").in(targetIds),
                cb.equal(root.get("isRead"), false)
            )
        );
        unread.forEach(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<?> clearAllNotifications() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        List<Long> targetIds = getCandidateUserIds();
        List<Notification> all = notificationRepository.findAll((root, query, cb) ->
            root.get("userId").in(targetIds)
        );
        notificationRepository.deleteAll(all);
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared"));
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String message = payload.get("message");
        String role = payload.get("role");
        String type = payload.get("type");

        notificationService.broadcastNotification(role, title, message, type);
        return ResponseEntity.ok(ApiResponse.success("Notification broadcasted successfully"));
    }

    @RequestMapping(value = "/{id}/read", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        if (notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Notification not found"));
        }
        
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
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
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot modify another user's notification."));
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        Notification notification = notificationService.getNotificationById(id);
        if (notification != null) {
            if (!SecurityUtils.isAdmin()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
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
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot delete another user's notification."));
                    }
                }
            }
            notificationService.deleteNotification(id);
        }
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
    }
}
