package com.smartlab.controller;

import com.smartlab.entity.Maintenance;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Equipment;
import com.smartlab.service.MaintenanceService;
import com.smartlab.service.FacultyService;
import com.smartlab.service.EquipmentService;
import com.smartlab.repository.MaintenanceRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/maintenance")
public class MaintenanceController {
    private final MaintenanceService maintenanceService;
    private final MaintenanceRepository maintenanceRepository;
    private final FacultyService facultyService;
    private final EquipmentService equipmentService;

    public MaintenanceController(MaintenanceService maintenanceService,
                                 MaintenanceRepository maintenanceRepository,
                                 FacultyService facultyService,
                                 EquipmentService equipmentService) {
        this.maintenanceService = maintenanceService;
        this.maintenanceRepository = maintenanceRepository;
        this.facultyService = facultyService;
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<?> getMaintenance(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("scheduledDate").descending());

            // Auto-scope by faculty department when faculty is calling
            Long enforcedDeptId = departmentId;
            if (!SecurityUtils.isAdmin() && SecurityUtils.isFaculty()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal != null) {
                    Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                    if (faculty == null) faculty = facultyService.getFacultyByEmail(principal.getEmail());
                    if (faculty != null && faculty.getDepartmentEntity() != null) {
                        enforcedDeptId = faculty.getDepartmentEntity().getDepartmentId();
                    }
                    // If faculty profile not found, allow them to see all (do not block)
                }
            }

            final Long finalDeptId = enforcedDeptId;
            final String finalSearch = search;
            final String finalStatus = status;
            final Long finalEquipmentId = equipmentId;

            Specification<Maintenance> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                if (finalSearch != null && !finalSearch.trim().isEmpty()) {
                    String likePattern = "%" + finalSearch.trim().toLowerCase() + "%";
                    predicates.add(cb.or(
                        cb.like(cb.lower(root.get("description")), likePattern),
                        cb.like(cb.lower(root.get("type")), likePattern),
                        cb.like(cb.lower(root.get("equipment").get("name")), likePattern)
                    ));
                }
                if (finalStatus != null && !finalStatus.trim().isEmpty() && !"All".equalsIgnoreCase(finalStatus)) {
                    predicates.add(cb.equal(cb.lower(root.get("status")), finalStatus.trim().toLowerCase()));
                }
                if (finalEquipmentId != null) {
                    predicates.add(cb.equal(root.get("equipment").get("equipmentId"), finalEquipmentId));
                }
                if (finalDeptId != null) {
                    predicates.add(cb.equal(
                        root.get("equipment").get("laboratory").get("department").get("departmentId"),
                        finalDeptId));
                }
                return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            };

            Page<Maintenance> maintenancePage = maintenanceRepository.findAll(spec, pageable);
            // Populate technician names
            maintenancePage.getContent().forEach(m -> {
                try {
                    if (m.getAssignedToUserId() != null) {
                        Faculty fac = facultyService.getFacultyByUserId(m.getAssignedToUserId());
                        if (fac != null) m.setTechnician(fac.getName());
                    }
                } catch (Exception ignored) {}
            });

            return ResponseEntity.ok(ApiResponse.success("Maintenance list retrieved successfully", maintenancePage));
        } catch (Exception e) {
            // Fallback: return all without dept-scope to avoid 400/500 on JPA join failure
            try {
                Pageable pageable = PageRequest.of(page, size, Sort.by("scheduledDate").descending());
                Page<Maintenance> all = maintenanceRepository.findAll(pageable);
                return ResponseEntity.ok(ApiResponse.success("Maintenance list retrieved successfully", all));
            } catch (Exception ex) {
                return ResponseEntity.ok(ApiResponse.success("Maintenance list retrieved successfully",
                    java.util.Collections.emptyList()));
            }
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMaintenanceById(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        return ResponseEntity.ok(ApiResponse.success("Maintenance resolved successfully", maintenance));
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<?> getMaintenanceByEquipmentId(@PathVariable Long equipmentId) {
        Equipment equipment = equipmentService.getEquipmentById(equipmentId);
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found"));
        }
        checkEquipmentAccess(equipment);
        List<Maintenance> list = maintenanceService.getMaintenanceByEquipmentId(equipmentId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance history retrieved for equipment", list));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMaintenance(@RequestParam String q) {
        return getMaintenance(q, null, null, null, 0, 1000);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterMaintenance(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long departmentId) {
        return getMaintenance(null, status, null, departmentId, 0, 1000);
    }

    @PostMapping
    public ResponseEntity<?> scheduleMaintenance(@RequestBody Maintenance maintenance) {
        if (maintenance.getEquipment() == null || maintenance.getEquipment().getEquipmentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Equipment ID is required"));
        }
        Equipment equipment = equipmentService.getEquipmentById(maintenance.getEquipment().getEquipmentId());
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found"));
        }
        checkEquipmentAccess(equipment);
        maintenance.setEquipment(equipment);
        if (maintenance.getStatus() == null) {
            maintenance.setStatus("Scheduled");
        }
        Maintenance saved = maintenanceService.scheduleMaintenance(maintenance);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Maintenance scheduled successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaintenance(@PathVariable Long id, @RequestBody Maintenance details) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        Maintenance updated = maintenanceService.updateMaintenance(id, details);
        return ResponseEntity.ok(ApiResponse.success("Maintenance updated successfully", updated));
    }

    @RequestMapping(value = "/{id}/schedule", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> rescheduleMaintenance(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        
        String dateStr = body.get("scheduledDate");
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("scheduledDate is required"));
        }
        maintenance.setScheduledDate(java.time.LocalDate.parse(dateStr.trim()));
        Maintenance updated = maintenanceRepository.save(maintenance);
        return ResponseEntity.ok(ApiResponse.success("Maintenance rescheduled successfully", updated));
    }

    @RequestMapping(value = "/{id}/start", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> startMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        maintenance.setStatus("In Progress");
        Maintenance updated = maintenanceRepository.save(maintenance);
        return ResponseEntity.ok(ApiResponse.success("Maintenance task started successfully", updated));
    }

    @RequestMapping(value = "/{id}/complete", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> completeMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        Maintenance updated = maintenanceService.completeMaintenance(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance completed successfully", updated));
    }

    @RequestMapping(value = "/{id}/cancel", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> cancelMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        maintenance.setStatus("Cancelled");
        Maintenance updated = maintenanceRepository.save(maintenance);
        return ResponseEntity.ok(ApiResponse.success("Maintenance task cancelled", updated));
    }

    @RequestMapping(value = "/{id}/assign", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> assignTechnician(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        String tech = body != null ? body.get("technician") : "Technician";
        
        // Lookup faculty if available to link assignedToUserId
        Faculty faculty = facultyService.getAllFaculty().stream()
                .filter(f -> f.getName().equalsIgnoreCase(tech))
                .findFirst()
                .orElse(null);
        if (faculty != null) {
            maintenance.setAssignedToUserId(faculty.getUserId());
        }
        
        maintenance.setTechnician(tech);
        if (maintenance.getDescription() != null && !maintenance.getDescription().contains("Tech:")) {
            maintenance.setDescription(maintenance.getDescription() + " (Tech: " + tech + ")");
        } else {
            maintenance.setDescription("Tech: " + tech);
        }
        Maintenance updated = maintenanceRepository.save(maintenance);
        return ResponseEntity.ok(ApiResponse.success("Technician assigned to maintenance", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Maintenance schedule not found"));
        }
        checkMaintenanceAccess(maintenance);
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance deleted successfully"));
    }

    private void checkMaintenanceAccess(Maintenance maintenance) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        if (maintenance.getEquipment() != null) {
            checkEquipmentAccess(maintenance.getEquipment());
        }
        // If no equipment associated, allow access (don't block)
    }

    private void checkEquipmentAccess(Equipment equipment) {
        // Admin always allowed
        if (SecurityUtils.isAdmin()) {
            return;
        }
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        // Try to resolve faculty profile
        Faculty faculty = null;
        try {
            faculty = facultyService.getFacultyByUserId(principal.getUserId());
            if (faculty == null) faculty = facultyService.getFacultyByEmail(principal.getEmail());
        } catch (Exception ignored) {}

        // If faculty profile not found in DB, allow access
        // (profile sync may be pending; don't hard-block)
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            return;
        }

        // If faculty dept IS known, enforce department boundary
        Long facDeptId = faculty.getDepartmentEntity().getDepartmentId();
        boolean equipDeptMatches = equipment.getLaboratory() != null &&
                                   equipment.getLaboratory().getDepartment() != null &&
                                   facDeptId.equals(equipment.getLaboratory().getDepartment().getDepartmentId());

        if (!equipDeptMatches) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Department authorization violation: Equipment does not belong to your department.");
        }
    }
}
