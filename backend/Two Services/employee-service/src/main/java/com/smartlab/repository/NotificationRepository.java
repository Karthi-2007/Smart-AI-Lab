package com.smartlab.repository;

import com.smartlab.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndUserRoleOrderByCreatedAtDesc(Long userId, String userRole);
}
