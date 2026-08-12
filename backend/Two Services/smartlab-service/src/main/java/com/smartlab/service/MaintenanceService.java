package com.smartlab.service;

import com.smartlab.entity.Maintenance;
import com.smartlab.repository.MaintenanceRepository;
import com.smartlab.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;
    private final FacultyRepository facultyRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, FacultyRepository facultyRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.facultyRepository = facultyRepository;
    }

    private Maintenance populateTechnicianName(Maintenance maintenance) {
        if (maintenance != null && maintenance.getAssignedToUserId() != null) {
            com.smartlab.entity.Faculty faculty = facultyRepository.findByUserId(maintenance.getAssignedToUserId());
            if (faculty != null) {
                maintenance.setTechnician(faculty.getName());
            }
        }
        return maintenance;
    }

    public List<Maintenance> getAllMaintenance() {
        List<Maintenance> list = maintenanceRepository.findAll();
        list.forEach(this::populateTechnicianName);
        return list;
    }

    public List<Maintenance> getMaintenanceByDepartment(Long departmentId) {
        List<Maintenance> list = maintenanceRepository.findByEquipmentLaboratoryDepartmentDepartmentId(departmentId);
        list.forEach(this::populateTechnicianName);
        return list;
    }

    public Maintenance getMaintenanceById(Long id) {
        Maintenance m = maintenanceRepository.findById(id).orElse(null);
        return populateTechnicianName(m);
    }

    public List<Maintenance> getMaintenanceByEquipmentId(Long equipmentId) {
        List<Maintenance> list = maintenanceRepository.findByEquipmentEquipmentId(equipmentId);
        list.forEach(this::populateTechnicianName);
        return list;
    }

    public Maintenance scheduleMaintenance(Maintenance maintenance) {
        if (maintenance.getStatus() == null) {
            maintenance.setStatus("Scheduled");
        }
        if (maintenance.getScheduledDate() == null) {
            maintenance.setScheduledDate(java.time.LocalDate.now());
        }
        Maintenance saved = maintenanceRepository.save(maintenance);
        return populateTechnicianName(saved);
    }

    public Maintenance updateMaintenance(Long id, Maintenance maintenanceDetails) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);
        if (maintenance != null) {
            maintenance.setStatus(maintenanceDetails.getStatus());
            maintenance.setNotes(maintenanceDetails.getNotes());
            if (maintenanceDetails.getScheduledDate() != null) {
                maintenance.setScheduledDate(maintenanceDetails.getScheduledDate());
            }
            if (maintenanceDetails.getCompletedDate() != null) {
                maintenance.setCompletedDate(maintenanceDetails.getCompletedDate());
            }
            if (maintenanceDetails.getAssignedToUserId() != null) {
                maintenance.setAssignedToUserId(maintenanceDetails.getAssignedToUserId());
            }
            if (maintenanceDetails.getType() != null) {
                maintenance.setType(maintenanceDetails.getType());
            }
            Maintenance saved = maintenanceRepository.save(maintenance);
            return populateTechnicianName(saved);
        }
        return null;
    }

    public Maintenance completeMaintenance(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);
        if (maintenance != null) {
            maintenance.setStatus("Completed");
            maintenance.setCompletedDate(java.time.LocalDate.now());
            Maintenance saved = maintenanceRepository.save(maintenance);
            return populateTechnicianName(saved);
        }
        return null;
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
