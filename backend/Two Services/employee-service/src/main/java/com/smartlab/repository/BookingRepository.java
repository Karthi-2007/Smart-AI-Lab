package com.smartlab.repository;

import com.smartlab.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudentStudentId(Long studentId);
    List<Booking> findByEquipmentEquipmentId(Long equipmentId);
    List<Booking> findByStatus(String status);
}
