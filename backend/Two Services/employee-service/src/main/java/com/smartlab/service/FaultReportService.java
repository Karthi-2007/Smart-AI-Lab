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

    public FaultReport getFaultById(Long id) {
        return faultReportRepository.findById(id).orElse(null);
    }

    public List<FaultReport> getFaultsByStudentId(Long studentId) {
        return faultReportRepository.findByReportedByStudentId(studentId);
    }

    public FaultReport reportFault(FaultReport faultReport) {
        if (faultReport.getEquipment() != null && faultReport.getEquipment().getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(faultReport.getEquipment().getEquipmentId())
                    .orElse(null);
            if (equipment != null) {
                faultReport.setEquipment(equipment);
            }
        }
        if (faultReport.getReportedBy() != null && faultReport.getReportedBy().getStudentId() != null) {
            Student student = studentRepository.findById(faultReport.getReportedBy().getStudentId())
                    .orElse(null);
            if (student != null) {
                faultReport.setReportedBy(student);
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
            Long studentId = saved.getReportedBy() != null ? saved.getReportedBy().getStudentId() : null;

            if (studentId != null) {
                notificationService.createNotification(studentId, "STUDENT", "Fault Reported", "Fault report for " + eqName + " has been submitted.", "Equipment");
            }
            facultyRepository.findAll().forEach(f -> {
                if (f.getFacultyId() != null) {
                    notificationService.createNotification(f.getFacultyId(), "FACULTY", "Fault Reported", reporterName + " reported a fault for " + eqName + ".", "Equipment");
                }
            });
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
