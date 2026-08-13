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
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final TelegramService telegramService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MaintenanceService.class);

    public MaintenanceService(MaintenanceRepository maintenanceRepository, 
                              FacultyRepository facultyRepository,
                              NotificationService notificationService,
                              EmailService emailService,
                              TelegramService telegramService) {
        this.maintenanceRepository = maintenanceRepository;
        this.facultyRepository = facultyRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.telegramService = telegramService;
    }

    private void sendMaintenanceNotifications(Maintenance saved, String actionTitle, String actionDesc) {
        try {
            String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
            
            // 1. Notify the assigned technician/faculty
            if (saved.getAssignedToUserId() != null) {
                com.smartlab.entity.Faculty faculty = facultyRepository.findByUserId(saved.getAssignedToUserId());
                if (faculty != null) {
                    notificationService.createNotification(faculty.getUserId(), "FACULTY", actionTitle, actionDesc + " (" + eqName + ")", "Maintenance");
                    if (faculty.getEmail() != null && !faculty.getEmail().trim().isEmpty()) {
                        String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                         "<tr><td class='label'>Type:</td><td class='value'>" + saved.getType() + "</td></tr>" +
                                         "<tr><td class='label'>Status:</td><td class='value' style='font-weight: bold;'>" + saved.getStatus() + "</td></tr>" +
                                         "<tr><td class='label'>Scheduled Date:</td><td class='value'>" + saved.getScheduledDate() + "</td></tr>";
                        String html = emailService.buildTemplate(actionTitle, actionTitle, actionDesc, details);
                        emailService.sendEmail(faculty.getEmail(), "SmartLab AI - " + actionTitle + ": " + eqName, html);
                    }
                    try {
                        telegramService.sendTelegramMessage("<b>SmartLab AI - Maintenance Alert</b>\nTitle: " + actionTitle + "\nEquipment: " + eqName + "\nStatus: " + saved.getStatus());
                    } catch (Exception e) {
                        log.warn("Failed to send maintenance Telegram alert: {}", e.getMessage());
                    }
                }
            }

            // 2. Notify all faculty members of the same department
            if (saved.getEquipment() != null &&
                saved.getEquipment().getLaboratory() != null &&
                saved.getEquipment().getLaboratory().getDepartment() != null) {
                
                Long deptId = saved.getEquipment().getLaboratory().getDepartment().getDepartmentId();
                facultyRepository.findAll().stream()
                    .filter(f -> f.getDepartmentEntity() != null && deptId.equals(f.getDepartmentEntity().getDepartmentId()))
                    .filter(f -> saved.getAssignedToUserId() == null || !f.getUserId().equals(saved.getAssignedToUserId()))
                    .forEach(f -> {
                        notificationService.createNotification(f.getUserId(), "FACULTY", actionTitle, actionDesc + " (" + eqName + ")", "Maintenance");
                        if (f.getEmail() != null && !f.getEmail().trim().isEmpty()) {
                            String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                             "<tr><td class='label'>Type:</td><td class='value'>" + saved.getType() + "</td></tr>" +
                                             "<tr><td class='label'>Status:</td><td class='value' style='font-weight: bold;'>" + saved.getStatus() + "</td></tr>";
                            String html = emailService.buildTemplate(actionTitle, actionTitle, actionDesc, details);
                            emailService.sendEmail(f.getEmail(), "SmartLab AI - " + actionTitle + ": " + eqName, html);
                        }
                    });
            }
        } catch (Exception e) {
            log.warn("Failed to send maintenance notifications: {}", e.getMessage());
        }
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
        
        sendMaintenanceNotifications(saved, "Maintenance Scheduled", "A new equipment maintenance task has been scheduled.");
        
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
            
            sendMaintenanceNotifications(saved, "Maintenance Updated", "The maintenance task has been updated.");
            
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
            
            sendMaintenanceNotifications(saved, "Maintenance Completed", "The equipment maintenance task has been completed successfully.");
            
            return populateTechnicianName(saved);
        }
        return null;
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
