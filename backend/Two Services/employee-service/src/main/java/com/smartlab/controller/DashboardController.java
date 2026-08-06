package com.smartlab.controller;

import com.smartlab.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/business/dashboard")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final LaboratoryRepository laboratoryRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final FaultReportRepository faultReportRepository;
    private final MaintenanceRepository maintenanceRepository;

    public DashboardController(
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            DepartmentRepository departmentRepository,
            LaboratoryRepository laboratoryRepository,
            EquipmentRepository equipmentRepository,
            BookingRepository bookingRepository,
            FaultReportRepository faultReportRepository,
            MaintenanceRepository maintenanceRepository) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.laboratoryRepository = laboratoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
        this.faultReportRepository = faultReportRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalStudents", studentRepository.count());
        data.put("totalFaculty", facultyRepository.count());
        data.put("totalDepartments", departmentRepository.count());
        data.put("totalLaboratories", laboratoryRepository.count());
        data.put("totalEquipments", equipmentRepository.count());

        // Bookings made today
        java.time.LocalDate today = java.time.LocalDate.now();
        long todayBookings = bookingRepository.findAll().stream()
                .filter(b -> {
                    if (b.getBookedAt() == null) return false;
                    java.time.LocalDate bookedDate = b.getBookedAt().toInstant()
                            .atZone(java.time.ZoneId.systemDefault())
                            .toLocalDate();
                    return today.equals(bookedDate);
                })
                .count();
        data.put("todayBookings", todayBookings);

        // Open/In Progress faults
        long activeFaults = faultReportRepository.findAll().stream()
                .filter(f -> "Open".equalsIgnoreCase(f.getStatus()) || "In Progress".equalsIgnoreCase(f.getStatus()))
                .count();
        data.put("activeFaults", activeFaults);

        // Scheduled maintenance
        long pendingMaintenance = maintenanceRepository.findAll().stream()
                .filter(m -> "Scheduled".equalsIgnoreCase(m.getStatus()))
                .count();
        data.put("pendingMaintenance", pendingMaintenance);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<Map<String, Object>> getStudentDashboard(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();

        long totalBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && id.equals(b.getStudent().getStudentId()))
                .count();

        long activeBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && id.equals(b.getStudent().getStudentId()) &&
                        ("Pending".equalsIgnoreCase(b.getStatus()) || "Approved".equalsIgnoreCase(b.getStatus())))
                .count();

        long completedBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && id.equals(b.getStudent().getStudentId()) &&
                        "Completed".equalsIgnoreCase(b.getStatus()))
                .count();

        long recentFaults = faultReportRepository.findAll().stream()
                .filter(f -> f.getReportedBy() != null && id.equals(f.getReportedBy().getStudentId()) &&
                        ("Open".equalsIgnoreCase(f.getStatus()) || "In Progress".equalsIgnoreCase(f.getStatus())))
                .count();

        data.put("totalBookings", totalBookings);
        data.put("activeBookings", activeBookings);
        data.put("completedBookings", completedBookings);
        data.put("recentFaults", recentFaults);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/faculty/{id}")
    public ResponseEntity<Map<String, Object>> getFacultyDashboard(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();

        long pendingBookings = bookingRepository.findAll().stream()
                .filter(b -> "Pending".equalsIgnoreCase(b.getStatus()))
                .count();

        long approvedBookings = bookingRepository.findAll().stream()
                .filter(b -> "Approved".equalsIgnoreCase(b.getStatus()))
                .count();

        long openFaults = faultReportRepository.findAll().stream()
                .filter(f -> "Open".equalsIgnoreCase(f.getStatus()))
                .count();

        data.put("pendingBookings", pendingBookings);
        data.put("approvedBookings", approvedBookings);
        data.put("faultCount", openFaults);

        return ResponseEntity.ok(data);
    }
}
