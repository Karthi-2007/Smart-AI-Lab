package com.smartlab.service;

import com.smartlab.entity.Faculty;
import com.smartlab.entity.Department;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;

    public FacultyService(FacultyRepository facultyRepository, DepartmentRepository departmentRepository) {
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id).orElse(null);
    }

    private Department findExistingDepartment(String inputName) {
        String nameLower = inputName.trim().toLowerCase();
        if (nameLower.contains("computer") || nameLower.equals("cse") || nameLower.equals("ece") || nameLower.contains("technology")) {
            return departmentRepository.findById(1L).orElse(null);
        }
        if (nameLower.contains("electrical") || nameLower.equals("eee") || nameLower.contains("electronics")) {
            return departmentRepository.findById(2L).orElse(null);
        }
        if (nameLower.contains("mechanical") || nameLower.equals("mech")) {
            return departmentRepository.findById(3L).orElse(null);
        }
        Department dept = departmentRepository.findByName(inputName);
        if (dept == null) {
            dept = departmentRepository.findByCode(inputName);
        }
        return dept;
    }

    private void resolveDepartment(Faculty faculty) {
        String deptName = faculty.getDepartment();
        if (deptName != null && !deptName.isBlank()) {
            Department dept = findExistingDepartment(deptName);
            if (dept == null) {
                dept = departmentRepository.save(new Department(null, deptName));
            }
            faculty.setDepartmentEntity(dept);
        }
    }

    public Faculty createFaculty(Faculty faculty) {
        if (faculty.getStatus() == null) {
            faculty.setStatus("ACTIVE");
        }
        // Upsert: if a profile already exists for this userId, update it instead of inserting
        if (faculty.getUserId() != null) {
            Faculty existing = facultyRepository.findByUserId(faculty.getUserId());
            if (existing != null) {
                return updateFaculty(existing.getFacultyId(), faculty);
            }
        }
        // Upsert: if a profile already exists for this email, update it
        if (faculty.getEmail() != null) {
            Faculty existing = facultyRepository.findByEmailIgnoreCase(faculty.getEmail());
            if (existing != null) {
                return updateFaculty(existing.getFacultyId(), faculty);
            }
        }
        resolveDepartment(faculty);
        return facultyRepository.save(faculty);
    }

    public Faculty updateFaculty(Long id, Faculty facultyDetails) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        if (faculty == null && facultyDetails.getEmail() != null) {
            faculty = facultyRepository.findByEmail(facultyDetails.getEmail());
        }
        if (faculty != null) {
            if (facultyDetails.getName() != null && !facultyDetails.getName().isBlank()) {
                faculty.setName(facultyDetails.getName());
            }
            if (facultyDetails.getEmail() != null && !facultyDetails.getEmail().isBlank()) {
                faculty.setEmail(facultyDetails.getEmail());
            }
            if (facultyDetails.getDepartment() != null && !facultyDetails.getDepartment().isBlank()) {
                faculty.setDepartment(facultyDetails.getDepartment());
                resolveDepartment(faculty);
            }
            if (facultyDetails.getDesignation() != null && !facultyDetails.getDesignation().isBlank()) {
                faculty.setDesignation(facultyDetails.getDesignation());
            }
            if (facultyDetails.getStatus() != null && !facultyDetails.getStatus().isBlank()) {
                faculty.setStatus(facultyDetails.getStatus());
            }
            if (facultyDetails.getLab() != null && !facultyDetails.getLab().isBlank()) {
                faculty.setLab(facultyDetails.getLab());
            }
            if (facultyDetails.getPhone() != null && !facultyDetails.getPhone().isBlank()) {
                faculty.setPhone(facultyDetails.getPhone());
            }
            if (facultyDetails.getUserId() != null) {
                faculty.setUserId(facultyDetails.getUserId());
            }
            return facultyRepository.save(faculty);
        }
        return null;
    }

    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }

    public Faculty getFacultyByEmail(String email) {
        if (email == null) return null;
        Faculty faculty = facultyRepository.findByEmailIgnoreCase(email.trim());
        if (faculty == null) {
            faculty = facultyRepository.findByEmail(email.trim());
        }
        return faculty;
    }

    public Faculty getFacultyByUserId(Long userId) {
        if (userId == null) return null;
        return facultyRepository.findByUserId(userId);
    }
}
