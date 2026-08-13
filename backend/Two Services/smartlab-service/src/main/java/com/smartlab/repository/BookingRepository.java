package com.smartlab.repository;

import com.smartlab.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {
    List<Booking> findByStudentStudentId(Long studentId);
    List<Booking> findByEquipmentEquipmentId(Long equipmentId);
    List<Booking> findByStatus(String status);
    List<Booking> findByEquipmentLaboratoryDepartmentDepartmentId(Long departmentId);
    List<Booking> findByEquipmentEquipmentIdAndBookingDate(Long equipmentId, java.time.LocalDate bookingDate);
}
