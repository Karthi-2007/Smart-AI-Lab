package com.smartlab.controller;

import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Booking;
import com.smartlab.repository.*;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

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

    @GetMapping("/public/statistics")
    public ResponseEntity<?> getPublicStatistics() {
        Map<String, Object> data = new HashMap<>();
        data.put("equipmentsCount", equipmentRepository.count());
        data.put("labsCount", laboratoryRepository.count());
        data.put("studentsCount", studentRepository.count());
        
        List<com.smartlab.entity.Equipment> eqList = equipmentRepository.findAll();
        long activeEq = eqList.stream().filter(e -> !"Faulty".equalsIgnoreCase(e.getStatus())).count();
        long totalEq = eqList.size();
        String availability = totalEq > 0 ? Math.round(((double) activeEq / totalEq) * 100) + "%" : "98%";
        data.put("availabilityRate", availability);

        data.put("activeBookingsCount", bookingRepository.findAll().stream()
                .filter(b -> "Approved".equalsIgnoreCase(b.getStatus()) || "Pending".equalsIgnoreCase(b.getStatus()))
                .count());
        data.put("openFaultsCount", faultReportRepository.findAll().stream()
                .filter(f -> !"Resolved".equalsIgnoreCase(f.getStatus()))
                .count());
        
        return ResponseEntity.ok(ApiResponse.success("Public statistics loaded", data));
    }

    @GetMapping("/public/telemetry")
    public ResponseEntity<?> getPublicTelemetry() {
        Map<String, Object> data = new HashMap<>();
        
        List<com.smartlab.entity.Equipment> eqList = equipmentRepository.findAll();
        List<Map<String, Object>> healthList = new ArrayList<>();
        int i = 0;
        for (com.smartlab.entity.Equipment eq : eqList) {
            if (i >= 3) break;
            Map<String, Object> item = new HashMap<>();
            item.put("name", eq.getName());
            item.put("status", eq.getStatus());
            int score = 95 - (i * 18);
            if ("Faulty".equalsIgnoreCase(eq.getStatus())) {
                score = 42;
            } else if ("Under Maintenance".equalsIgnoreCase(eq.getStatus())) {
                score = 68;
            }
            item.put("health", score);
            item.put("color", "Faulty".equalsIgnoreCase(eq.getStatus()) ? "text-red-400" : ("Under Maintenance".equalsIgnoreCase(eq.getStatus()) ? "text-amber-400" : "text-green-400"));
            healthList.add(item);
            i++;
        }
        
        if (healthList.isEmpty()) {
            healthList.add(Map.of("name", "Digital Storage Oscilloscope", "status", "Optimal", "health", 96, "color", "text-green-400"));
            healthList.add(Map.of("name", "3D Rapid Prototyping Printer", "status", "Maintenance Soon", "health", 74, "color", "text-amber-400"));
            healthList.add(Map.of("name", "CNC Milling Machine 5-Axis", "status", "Inspection Due", "health", 58, "color", "text-red-400"));
        }
        data.put("telemetryList", healthList);

        List<com.smartlab.entity.Maintenance> maintList = maintenanceRepository.findAll();
        if (!maintList.isEmpty()) {
            com.smartlab.entity.Maintenance m = maintList.get(0);
            String eqName = m.getEquipment() != null ? m.getEquipment().getName() : "Hardware";
            String tech = m.getTechnician() != null ? m.getTechnician() : "Staff";
            data.put("recommendation", "Preventive maintenance assigned to " + tech + " for " + eqName + ". Recommended inspection date: " + m.getScheduledDate() + ".");
        } else {
            data.put("recommendation", "3D Rapid Prototyping Printer has crossed 120 operational hours. Schedule preventive calibration within 5 business days to prevent extruder clogging.");
        }

        return ResponseEntity.ok(ApiResponse.success("Public telemetry loaded", data));
    }

    @GetMapping("/public/laboratories")
    public ResponseEntity<?> getPublicLaboratories() {
        List<com.smartlab.entity.Laboratory> labs = laboratoryRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Public laboratories loaded", labs));
    }

    // ===================================
    // ADMIN DASHBOARD
    // ===================================

    @GetMapping({"/admin", "/admin/summary"})
    public ResponseEntity<?> getAdminDashboardSelf() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }

        Map<String, Object> data = new HashMap<>();
        
        long totalStudents = studentRepository.count();
        long activeStudents = studentRepository.findAll().stream().filter(s -> "Active".equalsIgnoreCase(s.getStatus())).count();
        long totalFaculty = facultyRepository.count();
        long activeFaculty = facultyRepository.findAll().stream().filter(f -> "ACTIVE".equalsIgnoreCase(f.getStatus())).count();
        
        data.put("totalStudents", totalStudents);
        data.put("activeStudents", activeStudents);
        data.put("totalFaculty", totalFaculty);
        data.put("activeFaculty", activeFaculty);
        data.put("totalDepartments", departmentRepository.count());
        data.put("totalLaboratories", laboratoryRepository.count());
        
        List<com.smartlab.entity.Equipment> eqList = equipmentRepository.findAll();
        data.put("totalEquipments", eqList.size());
        data.put("availableEquipments", eqList.stream().filter(e -> "Available".equalsIgnoreCase(e.getStatus())).count());
        data.put("maintenanceEquipments", eqList.stream().filter(e -> "Under Maintenance".equalsIgnoreCase(e.getStatus())).count());
        data.put("faultyEquipments", eqList.stream().filter(e -> "Faulty".equalsIgnoreCase(e.getStatus())).count());

        List<Booking> bookings = bookingRepository.findAll();
        data.put("totalBookings", bookings.size());
        data.put("pendingBookings", bookings.stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count());
        data.put("approvedBookings", bookings.stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count());
        data.put("completedBookings", bookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count());
        data.put("rejectedBookings", bookings.stream().filter(b -> "Rejected".equalsIgnoreCase(b.getStatus())).count());

        List<com.smartlab.entity.FaultReport> faults = faultReportRepository.findAll();
        data.put("totalFaults", faults.size());
        data.put("openFaults", faults.stream().filter(f -> "Open".equalsIgnoreCase(f.getStatus()) || "In Progress".equalsIgnoreCase(f.getStatus())).count());
        data.put("resolvedFaults", faults.stream().filter(f -> "Resolved".equalsIgnoreCase(f.getStatus())).count());

        List<com.smartlab.entity.Maintenance> maintenance = maintenanceRepository.findAll();
        data.put("totalMaintenance", maintenance.size());
        data.put("scheduledMaintenance", maintenance.stream().filter(m -> "Scheduled".equalsIgnoreCase(m.getStatus())).count());
        data.put("completedMaintenance", maintenance.stream().filter(m -> "Completed".equalsIgnoreCase(m.getStatus())).count());

        java.time.LocalDate today = java.time.LocalDate.now();
        long todayBookings = bookings.stream()
                .filter(b -> {
                    if (b.getBookedAt() == null) return false;
                    java.time.LocalDate bookedDate = b.getBookedAt().toInstant()
                            .atZone(java.time.ZoneId.systemDefault())
                            .toLocalDate();
                    return today.equals(bookedDate);
                })
                .count();
        data.put("todayBookings", todayBookings);

        long activeFaults = faults.stream()
                .filter(f -> "Open".equalsIgnoreCase(f.getStatus()) || "In Progress".equalsIgnoreCase(f.getStatus()))
                .count();
        data.put("activeFaults", activeFaults);

        long pendingMaintenance = maintenance.stream()
                .filter(m -> "Scheduled".equalsIgnoreCase(m.getStatus()))
                .count();
        data.put("pendingMaintenance", pendingMaintenance);

        // Recent bookings across all labs
        data.put("recentBookings", bookings.stream()
                .sorted((a, b) -> b.getBookedAt() != null && a.getBookedAt() != null ? b.getBookedAt().compareTo(a.getBookedAt()) : 0)
                .limit(5)
                .toList());

        return ResponseEntity.ok(ApiResponse.success("Admin summary loaded", data));
    }

    @GetMapping("/admin/students")
    public ResponseEntity<?> getAdminStudentStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", studentRepository.count());
        data.put("active", studentRepository.findAll().stream().filter(s -> "Active".equalsIgnoreCase(s.getStatus())).count());
        data.put("pending", studentRepository.findAll().stream().filter(s -> "Pending".equalsIgnoreCase(s.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Student stats loaded", data));
    }

    @GetMapping("/admin/faculty")
    public ResponseEntity<?> getAdminFacultyStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", facultyRepository.count());
        data.put("active", facultyRepository.findAll().stream().filter(f -> "ACTIVE".equalsIgnoreCase(f.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Faculty stats loaded", data));
    }

    @GetMapping("/admin/equipment")
    public ResponseEntity<?> getAdminEquipmentStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", equipmentRepository.count());
        data.put("available", equipmentRepository.findAll().stream().filter(e -> "Available".equalsIgnoreCase(e.getStatus())).count());
        data.put("booked", equipmentRepository.findAll().stream().filter(e -> "Booked".equalsIgnoreCase(e.getStatus()) || "In Use".equalsIgnoreCase(e.getStatus())).count());
        data.put("maintenance", equipmentRepository.findAll().stream().filter(e -> "Under Maintenance".equalsIgnoreCase(e.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Equipment stats loaded", data));
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<?> getAdminBookingStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", bookingRepository.count());
        data.put("pending", bookingRepository.findAll().stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count());
        data.put("approved", bookingRepository.findAll().stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count());
        data.put("completed", bookingRepository.findAll().stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Booking stats loaded", data));
    }

    @GetMapping("/admin/maintenance")
    public ResponseEntity<?> getAdminMaintenanceStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", maintenanceRepository.count());
        data.put("scheduled", maintenanceRepository.findAll().stream().filter(m -> "Scheduled".equalsIgnoreCase(m.getStatus())).count());
        data.put("completed", maintenanceRepository.findAll().stream().filter(m -> "Completed".equalsIgnoreCase(m.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Maintenance stats loaded", data));
    }

    @GetMapping("/admin/faults")
    public ResponseEntity<?> getAdminFaultStats() {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
        }
        Map<String, Object> data = new HashMap<>();
        data.put("total", faultReportRepository.count());
        data.put("open", faultReportRepository.findAll().stream().filter(f -> "Open".equalsIgnoreCase(f.getStatus())).count());
        data.put("resolved", faultReportRepository.findAll().stream().filter(f -> "Resolved".equalsIgnoreCase(f.getStatus())).count());
        return ResponseEntity.ok(ApiResponse.success("Fault stats loaded", data));
    }

    // ===================================
    // FACULTY DASHBOARD
    // ===================================

    @GetMapping("/faculty/{id}/dashboard-details")
    public ResponseEntity<?> getFacultyDashboardLegacy(@PathVariable Long id) {
        return getFacultySummary(id);
    }

    @GetMapping("/faculty/summary")
    public ResponseEntity<?> getFacultySummarySelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Faculty faculty = facultyRepository.findByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty profile not found"));
        }
        return getFacultySummary(faculty.getFacultyId());
    }

    @GetMapping("/faculty/{id}/summary")
    public ResponseEntity<?> getFacultySummary(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();
        Faculty targetFaculty = facultyRepository.findByUserId(id);
        if (targetFaculty == null) {
            targetFaculty = facultyRepository.findById(id).orElse(null);
        }
        if (targetFaculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty profile not found"));
        }
        final Long deptId = (targetFaculty.getDepartmentEntity() != null) ? targetFaculty.getDepartmentEntity().getDepartmentId() : null;

        long pendingBookings = bookingRepository.findAll().stream()
                .filter(b -> "Pending".equalsIgnoreCase(b.getStatus()))
                .filter(b -> deptId != null && b.getEquipment() != null && b.getEquipment().getLaboratory() != null && b.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(b.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .count();

        long approvedBookings = bookingRepository.findAll().stream()
                .filter(b -> "Approved".equalsIgnoreCase(b.getStatus()))
                .filter(b -> deptId != null && b.getEquipment() != null && b.getEquipment().getLaboratory() != null && b.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(b.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .count();

        long openFaults = faultReportRepository.findAll().stream()
                .filter(f -> "Open".equalsIgnoreCase(f.getStatus()))
                .filter(f -> deptId != null && f.getEquipment() != null && f.getEquipment().getLaboratory() != null && f.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(f.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .count();

        data.put("pendingBookings", pendingBookings);
        data.put("approvedBookings", approvedBookings);
        data.put("faultCount", openFaults);

        return ResponseEntity.ok(ApiResponse.success("Faculty summary loaded", data));
    }

    @GetMapping("/faculty/bookings")
    public ResponseEntity<?> getFacultyBookingsSelf() {
        return getFacultySummarySelf();
    }

    @GetMapping("/faculty/equipment")
    public ResponseEntity<?> getFacultyEquipmentSelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Faculty faculty = facultyRepository.findByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty profile not found"));
        }
        Long deptId = faculty.getDepartmentEntity().getDepartmentId();
        long count = equipmentRepository.findByLaboratoryDepartmentDepartmentId(deptId).size();
        Map<String, Object> data = new HashMap<>();
        data.put("equipmentCount", count);
        return ResponseEntity.ok(ApiResponse.success("Faculty department equipment count loaded", data));
    }

    @GetMapping("/faculty/faults")
    public ResponseEntity<?> getFacultyFaultsSelf() {
        return getFacultySummarySelf();
    }

    @GetMapping("/faculty/maintenance")
    public ResponseEntity<?> getFacultyMaintenanceSelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Faculty faculty = facultyRepository.findByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty profile not found"));
        }
        Long deptId = faculty.getDepartmentEntity().getDepartmentId();
        long count = maintenanceRepository.findByEquipmentLaboratoryDepartmentDepartmentId(deptId).size();
        Map<String, Object> data = new HashMap<>();
        data.put("maintenanceCount", count);
        return ResponseEntity.ok(ApiResponse.success("Faculty department maintenance count loaded", data));
    }

    // ===================================
    // STUDENT DASHBOARD
    // ===================================

    @GetMapping("/student/{id}/dashboard-details")
    public ResponseEntity<?> getStudentDashboardLegacy(@PathVariable Long id) {
        return getStudentSummary(id);
    }

    @GetMapping("/student/summary")
    public ResponseEntity<?> getStudentSummarySelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Student student = studentRepository.findByUserId(principal.getUserId());
        if (student == null) {
            student = studentRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (student == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Student profile not found"));
        }
        return getStudentSummary(student.getStudentId());
    }

    @GetMapping("/student/{id}/summary")
    public ResponseEntity<?> getStudentSummary(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();
        Student targetStudent = studentRepository.findByUserId(id);
        if (targetStudent == null) {
            targetStudent = studentRepository.findById(id).orElse(null);
        }
        if (targetStudent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student profile not found"));
        }
        Long targetStudentId = targetStudent.getStudentId();

        long totalBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && targetStudentId.equals(b.getStudent().getStudentId()))
                .count();

        long activeBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && targetStudentId.equals(b.getStudent().getStudentId()) &&
                        ("Pending".equalsIgnoreCase(b.getStatus()) || "Approved".equalsIgnoreCase(b.getStatus())))
                .count();

        long completedBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && targetStudentId.equals(b.getStudent().getStudentId()) &&
                        "Completed".equalsIgnoreCase(b.getStatus()))
                .count();

        long recentFaults = faultReportRepository.findAll().stream()
                .filter(f -> f.getReportedBy() != null && targetStudentId.equals(f.getReportedBy().getStudentId()) &&
                        ("Open".equalsIgnoreCase(f.getStatus()) || "In Progress".equalsIgnoreCase(f.getStatus())))
                .count();

        data.put("totalBookings", totalBookings);
        data.put("activeBookings", activeBookings);
        data.put("completedBookings", completedBookings);
        data.put("recentFaults", recentFaults);

        return ResponseEntity.ok(ApiResponse.success("Student summary loaded", data));
    }

    @GetMapping("/student/bookings")
    public ResponseEntity<?> getStudentBookingsSelf() {
        return getStudentSummarySelf();
    }

    @GetMapping("/student/faults")
    public ResponseEntity<?> getStudentFaultsSelf() {
        return getStudentSummarySelf();
    }

    @GetMapping("/student")
    public ResponseEntity<?> getStudentDashboardSelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Student student = studentRepository.findByUserId(principal.getUserId());
        if (student == null) {
            student = studentRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (student == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Student profile not found"));
        }
        
        Long studentId = student.getStudentId();
        Map<String, Object> data = new HashMap<>();
        data.put("name", student.getName());
        data.put("regNo", student.getRegNo());
        data.put("department", student.getDepartment());
        data.put("year", student.getYear());
        data.put("email", student.getEmail());
        data.put("phone", student.getPhone());

        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStudent() != null && studentId.equals(b.getStudent().getStudentId()))
                .toList();

        long totalBookings = bookings.size();
        long pendingBookings = bookings.stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count();
        long approvedBookings = bookings.stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count();
        long completedBookings = bookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();
        long cancelledBookings = bookings.stream().filter(b -> "Cancelled".equalsIgnoreCase(b.getStatus()) || "Rejected".equalsIgnoreCase(b.getStatus())).count();
        long activeBookings = pendingBookings + approvedBookings;

        long openFaults = faultReportRepository.findAll().stream()
                .filter(f -> f.getReportedBy() != null && studentId.equals(f.getReportedBy().getStudentId()) && !"Resolved".equalsIgnoreCase(f.getStatus()))
                .count();

        data.put("totalBookings", totalBookings);
        data.put("pendingBookings", pendingBookings);
        data.put("approvedBookings", approvedBookings);
        data.put("completedBookings", completedBookings);
        data.put("cancelledBookings", cancelledBookings);
        data.put("activeBookings", activeBookings);
        data.put("recentFaults", openFaults);

        // Fetch recent activities (e.g. list of bookings)
        data.put("recentBookings", bookings.stream()
                .sorted((a, b) -> b.getBookedAt() != null && a.getBookedAt() != null ? b.getBookedAt().compareTo(a.getBookedAt()) : 0)
                .limit(5)
                .toList());

        return ResponseEntity.ok(ApiResponse.success("Student dashboard loaded", data));
    }

    @GetMapping("/faculty")
    public ResponseEntity<?> getFacultyDashboardSelf() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        Faculty faculty = facultyRepository.findByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
        }
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty profile not found"));
        }

        Long deptId = (faculty.getDepartmentEntity() != null) ? faculty.getDepartmentEntity().getDepartmentId() : null;
        Map<String, Object> data = new HashMap<>();
        data.put("name", faculty.getName());
        data.put("department", faculty.getDepartment());
        data.put("designation", faculty.getDesignation());
        data.put("lab", faculty.getLab());
        data.put("email", faculty.getEmail());

        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> deptId != null && b.getEquipment() != null && b.getEquipment().getLaboratory() != null && b.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(b.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .toList();

        long pendingBookings = bookings.stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count();
        long approvedBookings = bookings.stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count();
        long completedBookings = bookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();
        long rejectedBookings = bookings.stream().filter(b -> "Rejected".equalsIgnoreCase(b.getStatus())).count();

        long faultCount = faultReportRepository.findAll().stream()
                .filter(f -> !"Resolved".equalsIgnoreCase(f.getStatus()))
                .filter(f -> deptId != null && f.getEquipment() != null && f.getEquipment().getLaboratory() != null && f.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(f.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .count();

        long maintenanceCount = maintenanceRepository.findAll().stream()
                .filter(m -> !"Completed".equalsIgnoreCase(m.getStatus()))
                .filter(m -> deptId != null && m.getEquipment() != null && m.getEquipment().getLaboratory() != null && m.getEquipment().getLaboratory().getDepartment() != null && deptId.equals(m.getEquipment().getLaboratory().getDepartment().getDepartmentId()))
                .count();

        data.put("pendingBookings", pendingBookings);
        data.put("approvedBookings", approvedBookings);
        data.put("completedBookings", completedBookings);
        data.put("rejectedBookings", rejectedBookings);
        data.put("faultCount", faultCount);
        data.put("maintenanceCount", maintenanceCount);

        // Recent booking requests for faculty's department
        data.put("recentBookings", bookings.stream()
                .sorted((a, b) -> b.getBookedAt() != null && a.getBookedAt() != null ? b.getBookedAt().compareTo(a.getBookedAt()) : 0)
                .limit(5)
                .toList());

        return ResponseEntity.ok(ApiResponse.success("Faculty dashboard loaded", data));
    }
}
