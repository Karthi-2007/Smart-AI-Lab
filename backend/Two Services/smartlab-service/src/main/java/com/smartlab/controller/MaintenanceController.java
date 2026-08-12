package com.smartlab.controller;

import com.smartlab.entity.Maintenance;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Equipment;
import com.smartlab.service.MaintenanceService;
import com.smartlab.service.FacultyService;
import com.smartlab.service.EquipmentService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/business/maintenance")
public class MaintenanceController {
    private final MaintenanceService maintenanceService;
    private final FacultyService facultyService;
    private final EquipmentService equipmentService;

    public MaintenanceController(MaintenanceService maintenanceService,
                                 FacultyService facultyService,
                                 EquipmentService equipmentService) {
        this.maintenanceService = maintenanceService;
        this.facultyService = facultyService;
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public List<Maintenance> getAllMaintenance() {
        if (SecurityUtils.isAdmin()) {
            return maintenanceService.getAllMaintenance();
        }

        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        if (SecurityUtils.isFaculty()) {
            Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
            if (faculty == null) {
                faculty = facultyService.getFacultyByEmail(principal.getEmail());
            }
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                return maintenanceService.getMaintenanceByDepartment(faculty.getDepartmentEntity().getDepartmentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found.");
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        checkMaintenanceAccess(maintenance);
        return ResponseEntity.ok(maintenance);
    }

    @GetMapping("/equipment/{equipmentId}")
    public List<Maintenance> getMaintenanceByEquipmentId(@PathVariable Long equipmentId) {
        Equipment equipment = equipmentService.getEquipmentById(equipmentId);
        if (equipment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found");
        }
        checkEquipmentAccess(equipment);
        return maintenanceService.getMaintenanceByEquipmentId(equipmentId);
    }

    @PostMapping
    public Maintenance scheduleMaintenance(@RequestBody Maintenance maintenance) {
        if (maintenance.getEquipment() == null || maintenance.getEquipment().getEquipmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Equipment ID is required");
        }
        Equipment equipment = equipmentService.getEquipmentById(maintenance.getEquipment().getEquipmentId());
        if (equipment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found");
        }
        checkEquipmentAccess(equipment);
        maintenance.setEquipment(equipment);
        return maintenanceService.scheduleMaintenance(maintenance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(@PathVariable Long id, @RequestBody Maintenance details) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        checkMaintenanceAccess(maintenance);
        
        Maintenance updated = maintenanceService.updateMaintenance(id, details);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Maintenance> completeMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        checkMaintenanceAccess(maintenance);

        Maintenance updated = maintenanceService.completeMaintenance(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        checkMaintenanceAccess(maintenance);

        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }

    private void checkMaintenanceAccess(Maintenance maintenance) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        if (maintenance.getEquipment() != null) {
            checkEquipmentAccess(maintenance.getEquipment());
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Maintenance record has no associated equipment");
        }
    }

    private void checkEquipmentAccess(Equipment equipment) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyService.getFacultyByEmail(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found in database.");
        }

        Long facDeptId = faculty.getDepartmentEntity().getDepartmentId();

        boolean equipDeptMatches = equipment.getLaboratory() != null &&
                                   equipment.getLaboratory().getDepartment() != null &&
                                   facDeptId.equals(equipment.getLaboratory().getDepartment().getDepartmentId());

        if (!equipDeptMatches) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Department authorization violation: Equipment does not belong to your department.");
        }
    }
}
