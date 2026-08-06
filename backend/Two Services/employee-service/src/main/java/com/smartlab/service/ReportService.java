package com.smartlab.service;

import com.smartlab.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final FaultReportRepository faultReportRepository;
    private final MaintenanceRepository maintenanceRepository;

    public ReportService(
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            EquipmentRepository equipmentRepository,
            BookingRepository bookingRepository,
            FaultReportRepository faultReportRepository,
            MaintenanceRepository maintenanceRepository) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
        this.faultReportRepository = faultReportRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    public Map<String, Object> getSummaryReport() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", studentRepository.count());
        summary.put("totalFaculty", facultyRepository.count());
        summary.put("totalEquipment", equipmentRepository.count());
        summary.put("totalBookings", bookingRepository.count());
        summary.put("openFaults", faultReportRepository.findAll().stream().filter(f -> "Open".equalsIgnoreCase(f.getStatus())).count());
        summary.put("scheduledMaintenance", maintenanceRepository.findAll().stream().filter(m -> "Scheduled".equalsIgnoreCase(m.getStatus())).count());
        return summary;
    }

    public Map<String, Object> getEquipmentUsageReport() {
        Map<String, Object> usage = new HashMap<>();
        usage.put("totalEquipments", equipmentRepository.count());
        usage.put("totalBookings", bookingRepository.count());
        usage.put("approvedBookings", bookingRepository.findAll().stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count());
        usage.put("pendingBookings", bookingRepository.findAll().stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count());
        usage.put("rejectedBookings", bookingRepository.findAll().stream().filter(b -> "Rejected".equalsIgnoreCase(b.getStatus())).count());
        return usage;
    }

    public Map<String, Object> getAnalyticsReport() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalBookings", bookingRepository.count());
        analytics.put("totalFaults", faultReportRepository.count());
        analytics.put("totalMaintenance", maintenanceRepository.count());
        analytics.put("equipmentHealthScore", 94);
        return analytics;
    }
}
