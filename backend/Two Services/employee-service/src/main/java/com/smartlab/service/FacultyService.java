package com.smartlab.service;

import com.smartlab.entity.Faculty;
import com.smartlab.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id).orElse(null);
    }

    public Faculty createFaculty(Faculty faculty) {
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
            }
            if (facultyDetails.getDesignation() != null && !facultyDetails.getDesignation().isBlank()) {
                faculty.setDesignation(facultyDetails.getDesignation());
            }
            if (facultyDetails.getPhone() != null && !facultyDetails.getPhone().isBlank()) {
                faculty.setPhone(facultyDetails.getPhone());
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
}
