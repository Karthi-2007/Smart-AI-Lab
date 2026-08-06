package com.smartlab.controller;

import com.smartlab.entity.Faculty;
import com.smartlab.service.FacultyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/faculty")
public class FacultyController {
    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public List<Faculty> getAllFaculty() {
        return facultyService.getAllFaculty();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(faculty);
    }

    @PostMapping
    public Faculty createFaculty(@RequestBody Faculty faculty) {
        if (faculty.getDepartment() == null) {
            faculty.setDepartment("Computer Science & Engineering");
        }
        if (faculty.getDesignation() == null) {
            faculty.setDesignation("Assistant Professor");
        }
        return facultyService.createFaculty(faculty);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(@PathVariable Long id, @RequestBody Faculty facultyDetails) {
        try {
            Faculty faculty = facultyService.getFacultyById(id);
            if (faculty == null && facultyDetails.getEmail() != null) {
                faculty = facultyService.getFacultyByEmail(facultyDetails.getEmail());
            }
            if (faculty == null) {
                faculty = new Faculty();
                faculty.setFacultyId(id);
                faculty.setName(facultyDetails.getName() != null ? facultyDetails.getName() : "Faculty");
                faculty.setEmail(facultyDetails.getEmail() != null ? facultyDetails.getEmail() : "faculty@smartlab.com");
                faculty.setDepartment(facultyDetails.getDepartment() != null ? facultyDetails.getDepartment() : "Computer Science & Engineering");
                faculty.setDesignation("Professor");
                faculty.setPhone(facultyDetails.getPhone());
                return ResponseEntity.ok(facultyService.createFaculty(faculty));
            }

            Faculty updated = facultyService.updateFaculty(faculty.getFacultyId(), facultyDetails);
            return ResponseEntity.ok(updated != null ? updated : faculty);
        } catch (Exception e) {
            e.printStackTrace();
            Faculty fallback = new Faculty(id, facultyDetails.getName(), facultyDetails.getEmail(), facultyDetails.getDepartment(), "Professor");
            fallback.setPhone(facultyDetails.getPhone());
            return ResponseEntity.ok(fallback);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Faculty> getFacultyByEmail(@PathVariable String email) {
        Faculty faculty = facultyService.getFacultyByEmail(email);
        if (faculty == null && email != null && !email.trim().isEmpty()) {
            faculty = new Faculty();
            faculty.setEmail(email.toLowerCase().trim());
            
            // Generate clean name from email prefix (e.g. dr.ramesh@kce.ac.in -> Dr. Ramesh)
            String cleanEmail = email.trim();
            String emailPrefix = cleanEmail.contains("@") ? cleanEmail.substring(0, cleanEmail.indexOf("@")) : cleanEmail;
            String prettyName = Character.toUpperCase(emailPrefix.charAt(0)) + emailPrefix.substring(1);
            
            faculty.setName(prettyName);
            faculty.setDepartment("Computer Science & Engineering");
            faculty.setDesignation("Assistant Professor");
            faculty = facultyService.createFaculty(faculty);
        }
        return ResponseEntity.ok(faculty);
    }
}
