package com.smartlab.service;

import com.smartlab.entity.Equipment;
import com.smartlab.entity.FaultReport;
import com.smartlab.entity.Student;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.FaultReportRepository;
import com.smartlab.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import com.smartlab.repository.FacultyRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;

@Service
public class FaultReportService {
    private final FaultReportRepository faultReportRepository;
    private final EquipmentRepository equipmentRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final TelegramService telegramService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(FaultReportService.class);

    public FaultReportService(FaultReportRepository faultReportRepository,
                              EquipmentRepository equipmentRepository,
                              StudentRepository studentRepository,
                              FacultyRepository facultyRepository,
                              NotificationService notificationService,
                              EmailService emailService,
                              TelegramService telegramService) {
        this.faultReportRepository = faultReportRepository;
        this.equipmentRepository = equipmentRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.telegramService = telegramService;
    }

    public List<FaultReport> getAllFaults() {
        return faultReportRepository.findAll();
    }

    public List<FaultReport> getFaultsByDepartment(Long departmentId) {
        return faultReportRepository.findByEquipmentLaboratoryDepartmentDepartmentId(departmentId);
    }

    public FaultReport getFaultById(Long id) {
        return faultReportRepository.findById(id).orElse(null);
    }

    public List<FaultReport> getFaultsByStudentId(Long studentId) {
        Student student = studentRepository.findAll().stream()
                .filter(s -> studentId.equals(s.getUserId()) || studentId.equals(s.getStudentId()))
                .findFirst()
                .orElse(null);
        if (student != null) {
            return faultReportRepository.findByReportedByStudentId(student.getStudentId());
        }
        return faultReportRepository.findByReportedByStudentId(studentId);
    }

    public FaultReport reportFault(FaultReport faultReport) {
        // Resolve equipment from DB - required, not transient
        if (faultReport.getEquipment() != null && faultReport.getEquipment().getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(faultReport.getEquipment().getEquipmentId())
                    .orElse(null);
            if (equipment == null) {
                throw new IllegalArgumentException("Equipment not found with ID: " + faultReport.getEquipment().getEquipmentId());
            }
            faultReport.setEquipment(equipment);
        } else {
            throw new IllegalArgumentException("Equipment ID is required for fault report");
        }

        // Resolve student from DB - required, not transient
        if (faultReport.getReportedBy() != null && faultReport.getReportedBy().getStudentId() != null) {
            Long sid = faultReport.getReportedBy().getStudentId();
            Student student = studentRepository.findAll().stream()
                    .filter(s -> sid.equals(s.getUserId()) || sid.equals(s.getStudentId()))
                    .findFirst()
                    .orElse(null);
            if (student != null) {
                faultReport.setReportedBy(student);
                faultReport.setReportedByUserId(student.getUserId() != null ? student.getUserId() : student.getStudentId());
            } else {
                faultReport.setReportedBy(null); // allow saving without student if not found
            }
        }

        if (faultReport.getStatus() == null) {
            faultReport.setStatus("Open");
        }
        if (faultReport.getReportedAt() == null) {
            faultReport.setReportedAt(new Date());
        }
        FaultReport saved = faultReportRepository.save(faultReport);
        try {
            String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
            String reporterName = saved.getReportedBy() != null ? saved.getReportedBy().getName() : "A student";
            Long notifUserId = saved.getReportedBy() != null ? (saved.getReportedBy().getUserId() != null ? saved.getReportedBy().getUserId() : saved.getReportedBy().getStudentId()) : saved.getReportedByUserId();

            if (notifUserId != null) {
                notificationService.createNotification(notifUserId, "STUDENT", "Fault Reported", "Fault report for " + eqName + " has been submitted.", "Equipment");
            }
            // Send live alert ONLY to faculty members of the equipment's department
            if (saved.getEquipment() != null &&
                saved.getEquipment().getLaboratory() != null &&
                saved.getEquipment().getLaboratory().getDepartment() != null) {
                
                Long equipDeptId = saved.getEquipment().getLaboratory().getDepartment().getDepartmentId();
                facultyRepository.findAll().stream()
                    .filter(f -> f.getDepartmentEntity() != null && equipDeptId.equals(f.getDepartmentEntity().getDepartmentId()))
                    .forEach(f -> {
                        Long fUserId = f.getUserId() != null ? f.getUserId() : f.getFacultyId();
                        if (fUserId != null) {
                            notificationService.createNotification(fUserId, "FACULTY", "Fault Reported", reporterName + " reported a fault for " + eqName + ".", "Equipment");
                        }
                        // Send Email to Faculty
                        if (f.getEmail() != null && !f.getEmail().trim().isEmpty()) {
                            try {
                                String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                                 "<tr><td class='label'>Reported By:</td><td class='value'>" + reporterName + "</td></tr>" +
                                                 "<tr><td class='label'>Description:</td><td class='value'>" + saved.getDescription() + "</td></tr>";
                                String html = emailService.buildTemplate("New Fault Report", "New Fault Report Received", "A student has reported a fault for equipment in your department.", details);
                                emailService.sendEmail(f.getEmail(), "SmartLab AI - Fault Reported: " + eqName, html);
                            } catch (Exception e) {
                                log.warn("Failed to send fault email to faculty: {}", e.getMessage());
                            }
                        }
                        // Send Telegram Alert to Faculty
                        try {
                            telegramService.sendTelegramMessage("<b>SmartLab AI - Fault Reported</b>\nReporter: " + reporterName + "\nEquipment: " + eqName + "\nDescription: " + saved.getDescription());
                        } catch (Exception e) {
                            log.warn("Failed to send fault Telegram alert to faculty: {}", e.getMessage());
                        }
                    });
            }
        } catch (Exception e) {
            log.warn("Failed to notify of fault report: {}", e.getMessage());
        }
        return saved;
    }

    public FaultReport updateFaultStatus(Long id, String status) {
        FaultReport fault = faultReportRepository.findById(id).orElse(null);
        if (fault != null) {
            fault.setStatus(status);
            FaultReport saved = faultReportRepository.save(fault);
            
            // Notify student
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long studentUserId = saved.getReportedByUserId();
                if (studentUserId == null && saved.getReportedBy() != null) {
                    studentUserId = saved.getReportedBy().getUserId() != null ? saved.getReportedBy().getUserId() : saved.getReportedBy().getStudentId();
                }
                
                String actorName = "Staff/Faculty";
                try {
                    UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                    if (principal != null) {
                        actorName = principal.getName();
                    }
                } catch (Exception e) {}
                
                if (studentUserId != null) {
                    notificationService.createNotification(studentUserId, "STUDENT", "Fault Status Updated", "The status of the fault reported for " + eqName + " has changed to " + status + " by " + actorName + ".", "Equipment");
                }
                
                if (saved.getReportedBy() != null) {
                    // Send email
                    if (saved.getReportedBy().getEmail() != null && !saved.getReportedBy().getEmail().trim().isEmpty()) {
                        String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                         "<tr><td class='label'>Fault Description:</td><td class='value'>" + saved.getDescription() + "</td></tr>" +
                                         "<tr><td class='label'>Updated Status:</td><td class='value' style='font-weight: bold; color: #1e3a8a;'>" + status + "</td></tr>" +
                                         "<tr><td class='label'>Updated By:</td><td class='value' style='font-weight: bold; color: #1e3a8a;'>" + actorName + "</td></tr>";
                        String html = emailService.buildTemplate("Fault Status Update", "Fault Status Updated", "The status of your reported equipment fault has been updated by " + actorName + ".", details);
                        emailService.sendEmail(saved.getReportedBy().getEmail(), "SmartLab AI - Fault Status Update: " + eqName, html);
                    }
                    
                    // Send Telegram Alert
                    try {
                        telegramService.sendTelegramMessage("<b>SmartLab AI - Fault Status Update</b>\nEquipment: " + eqName + "\nNew Status: " + status + "\nUpdated by: " + actorName);
                    } catch (Exception e) {
                        log.warn("Failed to send fault Telegram alert: {}", e.getMessage());
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to notify student of fault status update: {}", e.getMessage());
            }
            
            return saved;
        }
        return null;
    }

    public FaultReport closeFault(Long id) {
        return updateFaultStatus(id, "Closed");
    }

    public void deleteFault(Long id) {
        faultReportRepository.deleteById(id);
    }
}
