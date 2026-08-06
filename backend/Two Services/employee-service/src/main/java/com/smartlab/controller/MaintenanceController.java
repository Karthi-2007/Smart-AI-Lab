package com.smartlab.controller;

import com.smartlab.entity.Maintenance;
import com.smartlab.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/maintenance")
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<Maintenance> getAllMaintenance() {
        return maintenanceService.getAllMaintenance();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.getMaintenanceById(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenance);
    }

    @GetMapping("/equipment/{equipmentId}")
    public List<Maintenance> getMaintenanceByEquipmentId(@PathVariable Long equipmentId) {
        return maintenanceService.getMaintenanceByEquipmentId(equipmentId);
    }

    @PostMapping
    public Maintenance scheduleMaintenance(@RequestBody Maintenance maintenance) {
        return maintenanceService.scheduleMaintenance(maintenance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(@PathVariable Long id, @RequestBody Maintenance details) {
        Maintenance updated = maintenanceService.updateMaintenance(id, details);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Maintenance> completeMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceService.completeMaintenance(id);
        if (maintenance == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenance);
    }
}
