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
        String nameClean = inputName.trim();
        List<Department> allDepts = departmentRepository.findAll();
        for (Department d : allDepts) {
            if (d.getName().equalsIgnoreCase(nameClean) || 
                (d.getCode() != null && d.getCode().equalsIgnoreCase(nameClean))) {
                return d;
            }
        }
        
        String nameLower = nameClean.toLowerCase();
        if (nameLower.contains("computer science") || nameLower.contains("cse") || nameLower.equals("cs")) {
            return departmentRepository.findById(1L).orElse(null);
        }
        if (nameLower.contains("electronics & communication") || nameLower.contains("ece") || 
            nameLower.contains("electronic") || nameLower.contains("communication")) {
            return departmentRepository.findById(7L).orElse(null);
        }
        if (nameLower.contains("electrical") || nameLower.contains("eee")) {
            return departmentRepository.findById(2L).orElse(null);
        }
        if (nameLower.contains("mechanical") || nameLower.contains("mech")) {
            return departmentRepository.findById(3L).orElse(null);
        }
        if (nameLower.contains("civil")) {
            return departmentRepository.findById(4L).orElse(null);
        }
        if (nameLower.contains("information technology") || nameLower.equals("it") || nameLower.contains(" it ")) {
            return departmentRepository.findById(5L).orElse(null);
        }
        if (nameLower.contains("artificial") || nameLower.contains("aids") || nameLower.contains("data science")) {
            return departmentRepository.findById(6L).orElse(null);
        }
        
        Department dept = departmentRepository.findByName(nameClean);
        if (dept == null) {
            dept = departmentRepository.findByCode(nameClean);
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
        if (faculty.getUserId() != null) {
            Faculty existing = facultyRepository.findByUserId(faculty.getUserId());
            if (existing != null) {
                return updateFaculty(existing.getFacultyId(), faculty, false);
            }
        }
        if (faculty.getEmail() != null) {
            Faculty existing = facultyRepository.findByEmailIgnoreCase(faculty.getEmail());
            if (existing != null) {
                return updateFaculty(existing.getFacultyId(), faculty, false);
            }
        }
        resolveDepartment(faculty);
        return facultyRepository.save(faculty);
    }

    public Faculty updateFaculty(Long id, Faculty facultyDetails) {
        return updateFaculty(id, facultyDetails, false);
    }

    public Faculty updateFaculty(Long id, Faculty facultyDetails, boolean isSync) {
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
            
            if (!isSync) {
                if (facultyDetails.getDepartment() != null && !facultyDetails.getDepartment().isBlank()) {
                    faculty.setDepartment(facultyDetails.getDepartment());
                    resolveDepartment(faculty);
                }
                if (facultyDetails.getDesignation() != null && !facultyDetails.getDesignation().isBlank()) {
                    faculty.setDesignation(facultyDetails.getDesignation());
                }
            } else {
                if (faculty.getDepartmentEntity() == null && facultyDetails.getDepartment() != null && !facultyDetails.getDepartment().isBlank()) {
                    faculty.setDepartment(facultyDetails.getDepartment());
                    resolveDepartment(faculty);
                }
                if (faculty.getDesignation() == null && facultyDetails.getDesignation() != null && !facultyDetails.getDesignation().isBlank()) {
                    faculty.setDesignation(facultyDetails.getDesignation());
                }
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
