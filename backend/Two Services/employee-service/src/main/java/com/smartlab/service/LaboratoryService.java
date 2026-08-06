package com.smartlab.service;

import com.smartlab.entity.Laboratory;
import com.smartlab.repository.LaboratoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratoryService {
    private final LaboratoryRepository laboratoryRepository;

    public LaboratoryService(LaboratoryRepository laboratoryRepository) {
        this.laboratoryRepository = laboratoryRepository;
    }

    public List<Laboratory> getAllLabs() {
        return laboratoryRepository.findAll();
    }

    public Laboratory getLabById(Long id) {
        return laboratoryRepository.findById(id).orElse(null);
    }

    public Laboratory createLab(Laboratory lab) {
        if (lab.getDepartment() == null || lab.getDepartment().getDepartmentId() == null) {
            com.smartlab.entity.Department dept = new com.smartlab.entity.Department();
            dept.setDepartmentId(1L);
            lab.setDepartment(dept);
        }
        return laboratoryRepository.save(lab);
    }

    public Laboratory updateLab(Long id, Laboratory labDetails) {
        Laboratory lab = laboratoryRepository.findById(id).orElse(null);
        if (lab != null) {
            lab.setName(labDetails.getName());
            lab.setLocation(labDetails.getLocation());
            if (labDetails.getDepartment() != null) {
                lab.setDepartment(labDetails.getDepartment());
            }
            return laboratoryRepository.save(lab);
        }
        return null;
    }

    public void deleteLab(Long id) {
        laboratoryRepository.deleteById(id);
    }
}
