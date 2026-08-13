package com.smartlab.service;

import com.smartlab.entity.Laboratory;
import com.smartlab.repository.LaboratoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratoryService {
    private final LaboratoryRepository laboratoryRepository;
    private final com.smartlab.repository.EquipmentRepository equipmentRepository;
    private final com.smartlab.repository.FacultyRepository facultyRepository;
    private final com.smartlab.repository.StudentRepository studentRepository;

    public LaboratoryService(
        LaboratoryRepository laboratoryRepository,
        com.smartlab.repository.EquipmentRepository equipmentRepository,
        com.smartlab.repository.FacultyRepository facultyRepository,
        com.smartlab.repository.StudentRepository studentRepository
    ) {
        this.laboratoryRepository = laboratoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
    }

    public List<Laboratory> getAllLabs() {
        List<Laboratory> labs = laboratoryRepository.findAll();
        for (Laboratory lab : labs) {
            if (lab.getLabId() != null) {
                lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
            }
        }
        return labs;
    }

    public Laboratory getLabById(Long id) {
        Laboratory lab = laboratoryRepository.findById(id).orElse(null);
        if (lab != null && lab.getLabId() != null) {
            lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
        }
        return lab;
    }

    public Laboratory createLab(Laboratory lab) {
        if (lab.getDepartment() == null || lab.getDepartment().getDepartmentId() == null) {
            com.smartlab.entity.Department dept = new com.smartlab.entity.Department();
            dept.setDepartmentId(1L);
            lab.setDepartment(dept);
        }
        if (lab.getStatus() == null) {
            lab.setStatus("Active");
        }
        Laboratory saved = laboratoryRepository.save(lab);
        saved.setEquipmentCount(0);
        return saved;
    }

    public Laboratory updateLab(Long id, Laboratory labDetails) {
        Laboratory lab = laboratoryRepository.findById(id).orElse(null);
        if (lab != null) {
            lab.setName(labDetails.getName());
            lab.setLocation(labDetails.getLocation());
            lab.setCapacity(labDetails.getCapacity());
            lab.setStatus(labDetails.getStatus());
            if (labDetails.getDepartment() != null) {
                lab.setDepartment(labDetails.getDepartment());
            }
            Laboratory saved = laboratoryRepository.save(lab);
            if (saved.getLabId() != null) {
                saved.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(saved.getLabId()));
            }
            return saved;
        }
        return null;
    }

    public void deleteLab(Long id) {
        laboratoryRepository.deleteById(id);
    }

    public List<Laboratory> getLabsByDepartment(Long deptId) {
        List<Laboratory> labs = laboratoryRepository.findByDepartmentDepartmentId(deptId);
        for (Laboratory lab : labs) {
            if (lab.getLabId() != null) {
                lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
            }
        }
        return labs;
    }

    public com.smartlab.entity.Faculty getFacultyByUserIdOrEmail(Long userId, String email) {
        com.smartlab.entity.Faculty f = facultyRepository.findByUserId(userId);
        if (f == null && email != null) {
            f = facultyRepository.findByEmailIgnoreCase(email);
        }
        return f;
    }

    public com.smartlab.entity.Student getStudentByUserIdOrEmail(Long userId, String email) {
        com.smartlab.entity.Student s = studentRepository.findByUserId(userId);
        if (s == null && email != null) {
            s = studentRepository.findByEmailIgnoreCase(email);
        }
        return s;
    }
}
