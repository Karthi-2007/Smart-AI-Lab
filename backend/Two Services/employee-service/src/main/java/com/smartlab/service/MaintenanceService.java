package com.smartlab.service;

import com.smartlab.entity.Maintenance;
import com.smartlab.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id).orElse(null);
    }

    public List<Maintenance> getMaintenanceByEquipmentId(Long equipmentId) {
        return maintenanceRepository.findByEquipmentEquipmentId(equipmentId);
    }

    public Maintenance scheduleMaintenance(Maintenance maintenance) {
        if (maintenance.getStatus() == null) {
            maintenance.setStatus("Scheduled");
        }
        if (maintenance.getScheduledAt() == null) {
            maintenance.setScheduledAt(new Date());
        }
        return maintenanceRepository.save(maintenance);
    }

    public Maintenance updateMaintenance(Long id, Maintenance maintenanceDetails) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);
        if (maintenance != null) {
            maintenance.setStatus(maintenanceDetails.getStatus());
            maintenance.setNotes(maintenanceDetails.getNotes());
            if (maintenanceDetails.getScheduledAt() != null) {
                maintenance.setScheduledAt(maintenanceDetails.getScheduledAt());
            }
            return maintenanceRepository.save(maintenance);
        }
        return null;
    }

    public Maintenance completeMaintenance(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);
        if (maintenance != null) {
            maintenance.setStatus("Completed");
            return maintenanceRepository.save(maintenance);
        }
        return null;
    }
}
