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

@Service
public class FaultReportService {
    private final FaultReportRepository faultReportRepository;
    private final EquipmentRepository equipmentRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final NotificationService notificationService;

    public FaultReportService(FaultReportRepository faultReportRepository,
                              EquipmentRepository equipmentRepository,
                              StudentRepository studentRepository,
                              FacultyRepository facultyRepository,
                              NotificationService notificationService) {
        this.faultReportRepository = faultReportRepository;
        this.equipmentRepository = equipmentRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.notificationService = notificationService;
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
                    });
            }
        } catch (Exception e) {}
        return saved;
    }

    public FaultReport updateFaultStatus(Long id, String status) {
        FaultReport fault = faultReportRepository.findById(id).orElse(null);
        if (fault != null) {
            fault.setStatus(status);
            return faultReportRepository.save(fault);
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
