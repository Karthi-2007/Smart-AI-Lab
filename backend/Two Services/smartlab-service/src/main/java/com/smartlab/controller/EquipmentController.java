package com.smartlab.controller;

import com.smartlab.entity.Equipment;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Booking;
import com.smartlab.entity.Maintenance;
import com.smartlab.entity.FaultReport;
import com.smartlab.service.EquipmentService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.MaintenanceRepository;
import com.smartlab.repository.FaultReportRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/equipments")
public class EquipmentController {
    private final EquipmentService equipmentService;
    private final EquipmentRepository equipmentRepository;
    private final StudentService studentService;
    private final FacultyService facultyService;
    private final BookingRepository bookingRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FaultReportRepository faultReportRepository;

    public EquipmentController(EquipmentService equipmentService,
                               EquipmentRepository equipmentRepository,
                               StudentService studentService,
                               FacultyService facultyService,
                               BookingRepository bookingRepository,
                               MaintenanceRepository maintenanceRepository,
                               FaultReportRepository faultReportRepository) {
        this.equipmentService = equipmentService;
        this.equipmentRepository = equipmentRepository;
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.bookingRepository = bookingRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.faultReportRepository = faultReportRepository;
    }

    @GetMapping
    public ResponseEntity<?> getEquipment(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long labId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        try {
            Long enforcedDeptId = departmentId;
            if (!SecurityUtils.isAdmin()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal != null) {
                    if (SecurityUtils.isStudent()) {
                        Student student = studentService.getStudentByUserId(principal.getUserId());
                        if (student == null) {
                            student = studentService.getStudentByEmail(principal.getEmail());
                        }
                        if (student != null && student.getDepartmentEntity() != null) {
                            enforcedDeptId = student.getDepartmentEntity().getDepartmentId();
                        }
                    } else if (SecurityUtils.isFaculty()) {
                        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                        if (faculty == null) {
                            faculty = facultyService.getFacultyByEmail(principal.getEmail());
                        }
                        if (faculty != null && faculty.getDepartmentEntity() != null) {
                            enforcedDeptId = faculty.getDepartmentEntity().getDepartmentId();
                        }
                    }
                }
            }

            final Long deptIdFilter = enforcedDeptId;
            final String searchFinal = search;
            final String statusFinal = status;
            final String categoryFinal = category;
            Specification<Equipment> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                if (searchFinal != null && !searchFinal.trim().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + searchFinal.trim().toLowerCase() + "%"));
                }
                if (labId != null) {
                    predicates.add(cb.equal(root.get("laboratory").get("labId"), labId));
                }
                if (deptIdFilter != null) {
                    predicates.add(cb.equal(root.get("laboratory").get("department").get("departmentId"), deptIdFilter));
                }
                if (statusFinal != null && !statusFinal.trim().isEmpty()) {
                    predicates.add(cb.equal(cb.lower(root.get("status")), statusFinal.trim().toLowerCase()));
                }
                if (categoryFinal != null && !categoryFinal.trim().isEmpty()) {
                    predicates.add(cb.equal(cb.lower(root.get("category")), categoryFinal.trim().toLowerCase()));
                }
                return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            };

            List<Equipment> list = equipmentRepository.findAll(spec);
            return ResponseEntity.ok(ApiResponse.success("Equipments retrieved successfully", list));
        } catch (Exception e) {
            List<Equipment> all = equipmentRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success("Equipments retrieved successfully", all));
        }
    }

    // ── Dedicated GET Endpoints for Equipment Tab Filters ─────────
    @GetMapping("/all")
    public ResponseEntity<?> getEquipmentsAll() {
        return getEquipment(null, null, null, null, null);
    }

    @GetMapping("/available")
    public ResponseEntity<?> getEquipmentsAvailable() {
        return getEquipment(null, null, null, "Available", null);
    }

    @GetMapping("/under-maintenance")
    public ResponseEntity<?> getEquipmentsUnderMaintenance() {
        return getEquipment(null, null, null, "Under Maintenance", null);
    }

    @GetMapping("/faulty")
    public ResponseEntity<?> getEquipmentsFaulty() {
        return getEquipment(null, null, null, "Faulty", null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getEquipmentById(id);
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Equipment retrieved successfully", equipment));
    }

    @GetMapping("/available-for-student")
    public ResponseEntity<?> getAvailableForStudent(
            @RequestParam(required = false) String search) {
        try {
            Long deptId = null;

            // Resolve student's department from JWT context
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                Student student = null;
                if (principal.getUserId() != null) {
                    student = studentService.getStudentByUserId(principal.getUserId());
                }
                if (student == null && principal.getEmail() != null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student != null && student.getDepartmentEntity() != null) {
                    deptId = student.getDepartmentEntity().getDepartmentId();
                }
            }

            final Long finalDeptId = deptId;
            final String finalSearch = search;

            Specification<Equipment> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                // Only show available equipment
                predicates.add(cb.equal(root.get("status"), "Available"));
                // Scope to student department if resolved
                if (finalDeptId != null) {
                    predicates.add(cb.equal(
                        root.get("laboratory").get("department").get("departmentId"),
                        finalDeptId));
                }
                // Optional search filter
                if (finalSearch != null && !finalSearch.trim().isEmpty()) {
                    predicates.add(cb.like(
                        cb.lower(root.get("name")),
                        "%" + finalSearch.trim().toLowerCase() + "%"));
                }
                return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            };

            List<Equipment> list = equipmentRepository.findAll(spec);
            return ResponseEntity.ok(ApiResponse.success("Available equipments retrieved successfully", list));
        } catch (Exception e) {
            // Fallback: return all available equipment without department scope
            try {
                List<Equipment> fallback = equipmentRepository.findAll(
                    (root, query, cb) -> cb.equal(root.get("status"), "Available"));
                return ResponseEntity.ok(ApiResponse.success("Available equipments retrieved successfully", fallback));
            } catch (Exception ex) {
                return ResponseEntity.ok(ApiResponse.success("Available equipments retrieved successfully", java.util.Collections.emptyList()));
            }
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchEquipment(@RequestParam String q) {
        return getEquipment(q, null, null, null, null);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterEquipment(
            @RequestParam(required = false) Long laboratoryId,
            @RequestParam(required = false) String status) {
        return getEquipment(null, laboratoryId, null, status, null);
    }

    @GetMapping("/by-laboratory/{labId}")
    public ResponseEntity<?> getEquipmentByLaboratory(@PathVariable Long labId) {
        List<Equipment> equipment = equipmentRepository.findByLaboratoryLabId(labId);
        return ResponseEntity.ok(ApiResponse.success("Equipment loaded for lab ID: " + labId, equipment));
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getEquipmentByStatus(@PathVariable String status) {
        return getEquipment(null, null, null, status, null);
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableEquipment() {
        return getEquipment(null, null, null, "Available", null);
    }

    @PostMapping
    public ResponseEntity<?> createEquipment(@RequestBody Equipment equipment) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.isFaculty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only faculty or admin can create equipment."));
        }
        if (equipment.getStatus() == null) {
            equipment.setStatus("Available");
        }
        Equipment saved = equipmentService.createEquipment(equipment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Equipment created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipmentDetails) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.isFaculty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only faculty or admin can update equipment."));
        }
        Equipment updated = equipmentService.updateEquipment(id, equipmentDetails);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found for update"));
        }
        return ResponseEntity.ok(ApiResponse.success("Equipment updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        return setEquipmentStatus(id, status);
    }

    @PutMapping("/{id}/mark-available")
    public ResponseEntity<?> markAvailable(@PathVariable Long id) {
        return setEquipmentStatus(id, "Available");
    }

    @PutMapping("/{id}/mark-booked")
    public ResponseEntity<?> markBooked(@PathVariable Long id) {
        return setEquipmentStatus(id, "Booked");
    }

    @PutMapping("/{id}/mark-maintenance")
    public ResponseEntity<?> markMaintenance(@PathVariable Long id) {
        return setEquipmentStatus(id, "Under Maintenance");
    }

    @PutMapping("/{id}/mark-faulty")
    public ResponseEntity<?> markFaulty(@PathVariable Long id) {
        return setEquipmentStatus(id, "Faulty");
    }

    private ResponseEntity<?> setEquipmentStatus(Long id, String status) {
        Equipment equipment = equipmentService.getEquipmentById(id);
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found"));
        }
        equipment.setStatus(status);
        Equipment updated = equipmentService.updateEquipment(id, equipment);
        return ResponseEntity.ok(ApiResponse.success("Equipment status updated to: " + status, updated));
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateImage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("imageUrl is required"));
        }
        Equipment equipment = equipmentService.getEquipmentById(id);
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found"));
        }
        equipment.setImageUrl(imageUrl);
        Equipment updated = equipmentService.updateEquipment(id, equipment);
        return ResponseEntity.ok(ApiResponse.success("Equipment image updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@PathVariable Long id) {
        if (!SecurityUtils.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only admin can delete equipment."));
        }
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(ApiResponse.success("Equipment deleted successfully"));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<?> getEquipmentBookings(@PathVariable Long id) {
        List<Booking> bookings = bookingRepository.findByEquipmentEquipmentId(id);
        return ResponseEntity.ok(ApiResponse.success("Booking history retrieved for equipment ID: " + id, bookings));
    }

    @GetMapping("/{id}/booking-history")
    public ResponseEntity<?> getEquipmentBookingHistory(@PathVariable Long id) {
        return getEquipmentBookings(id);
    }

    @GetMapping("/{id}/maintenance")
    public ResponseEntity<?> getEquipmentMaintenance(@PathVariable Long id) {
        List<Maintenance> maintenanceList = maintenanceRepository.findByEquipmentEquipmentId(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance history retrieved for equipment ID: " + id, maintenanceList));
    }

    @GetMapping("/{id}/maintenance-history")
    public ResponseEntity<?> getEquipmentMaintenanceHistory(@PathVariable Long id) {
        return getEquipmentMaintenance(id);
    }

    @GetMapping("/{id}/faults")
    public ResponseEntity<?> getEquipmentFaults(@PathVariable Long id) {
        List<FaultReport> faults = faultReportRepository.findByEquipmentEquipmentId(id);
        return ResponseEntity.ok(ApiResponse.success("Fault report history retrieved for equipment ID: " + id, faults));
    }

    @GetMapping("/{id}/usage")
    public ResponseEntity<?> getEquipmentUsage(@PathVariable Long id) {
        List<Booking> bookings = bookingRepository.findByEquipmentEquipmentId(id);
        long completed = bookings.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();
        long active = bookings.stream().filter(b -> "Issued".equalsIgnoreCase(b.getStatus()) || "Approved".equalsIgnoreCase(b.getStatus())).count();
        long total = bookings.size();

        Map<String, Object> usage = new HashMap<>();
        usage.put("totalBookings", total);
        usage.put("completedBookings", completed);
        usage.put("activeBookings", active);
        usage.put("usageRate", total > 0 ? (double) completed / total : 0.0);
        return ResponseEntity.ok(ApiResponse.success("Usage stats computed", usage));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getAvailability(
            @PathVariable Long id,
            @RequestParam String date) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        List<Booking> bookings = bookingRepository.findByEquipmentEquipmentIdAndBookingDate(id, localDate);
        
        List<String> standardSlots = List.of("09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00");
        Map<String, Integer> bookedCounts = new java.util.HashMap<>();
        for (String slot : standardSlots) {
            bookedCounts.put(slot, 0);
        }
        
        for (Booking b : bookings) {
            if (!"Cancelled".equalsIgnoreCase(b.getStatus()) && !"Rejected".equalsIgnoreCase(b.getStatus())) {
                String slot = b.getTimeSlot();
                if (bookedCounts.containsKey(slot)) {
                    bookedCounts.put(slot, bookedCounts.get(slot) + 1);
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Slot availability resolved", bookedCounts));
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportEquipment() {
        List<Equipment> all = equipmentRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Export complete", all));
    }

    @PostMapping("/import")
    public ResponseEntity<?> importEquipment(@RequestBody List<Equipment> equipments) {
        List<Equipment> imported = new ArrayList<>();
        for (Equipment e : equipments) {
            imported.add(equipmentService.createEquipment(e));
        }
        return ResponseEntity.ok(ApiResponse.success("Successfully imported " + imported.size() + " equipment items", imported));
    }
}
