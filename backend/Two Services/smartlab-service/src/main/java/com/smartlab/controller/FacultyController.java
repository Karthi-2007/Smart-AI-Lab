package com.smartlab.controller;

import com.smartlab.entity.Faculty;
import com.smartlab.service.FacultyService;
import com.smartlab.service.LaboratoryService;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/faculty")
public class FacultyController {
    private final FacultyService facultyService;
    private final FacultyRepository facultyRepository;
    private final LaboratoryService laboratoryService;

    public FacultyController(FacultyService facultyService, 
                             FacultyRepository facultyRepository, 
                             LaboratoryService laboratoryService) {
        this.facultyService = facultyService;
        this.facultyRepository = facultyRepository;
        this.laboratoryService = laboratoryService;
    }

    @GetMapping
    public ResponseEntity<?> getFaculty(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        
        Specification<Faculty> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("email")), likePattern)
                ));
            }
            if (department != null && !department.trim().isEmpty() && !"All Departments".equalsIgnoreCase(department)) {
                String deptClean = department.trim().toLowerCase();
                if ("cse".equals(deptClean)) {
                    predicates.add(cb.like(cb.lower(root.get("department").get("name")), "%computer science%"));
                } else if ("ece".equals(deptClean)) {
                    predicates.add(cb.like(cb.lower(root.get("department").get("name")), "%electronics%"));
                } else if ("eee".equals(deptClean)) {
                    predicates.add(cb.like(cb.lower(root.get("department").get("name")), "%electrical%"));
                } else {
                    predicates.add(cb.like(cb.lower(root.get("department").get("name")), "%" + deptClean + "%"));
                }
            }
            if (designation != null && !designation.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("designation")), "%" + designation.trim().toLowerCase() + "%"));
            }
            if (status != null && !status.trim().isEmpty() && !"Status".equalsIgnoreCase(status)) {
                String statusClean = status.trim().toLowerCase();
                if ("activated".equals(statusClean) || "active".equals(statusClean)) {
                    predicates.add(cb.or(
                        cb.equal(cb.lower(root.get("status")), "active"),
                        cb.equal(cb.lower(root.get("status")), "activated")
                    ));
                } else {
                    predicates.add(cb.equal(cb.lower(root.get("status")), statusClean));
                }
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Faculty> resultPage = facultyRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("Faculty retrieved successfully", resultPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFacultyById(@PathVariable Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Faculty retrieved successfully", faculty));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getFacultyAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getFaculty(null, null, null, null, page, size);
    }

    @GetMapping("/active")
    public ResponseEntity<?> getFacultyActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getFaculty(null, null, null, "active", page, size);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getFacultyPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getFaculty(null, null, null, "pending", page, size);
    }

    @GetMapping("/department/{deptCode}")
    public ResponseEntity<?> getFacultyByDepartmentCode(
            @PathVariable String deptCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getFaculty(null, deptCode, null, null, page, size);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFaculty(@RequestParam String q) {
        return getFaculty(q, null, null, null, 0, 1000);
    }

    @GetMapping("/by-department/{departmentCode}")
    public ResponseEntity<?> getFacultyByDepartment(@PathVariable String departmentCode) {
        return getFaculty(null, departmentCode, null, null, 0, 1000);
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getFacultyByStatus(@PathVariable String status) {
        return getFaculty(null, null, null, status, 0, 1000);
    }

    @PostMapping
    public ResponseEntity<?> createFaculty(@RequestBody Faculty faculty) {
        if (faculty.getUserId() == null) {
            faculty.setUserId(faculty.getFacultyId());
        }
        if (faculty.getUserId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User ID / Faculty ID is required"));
        }
        if (faculty.getDepartment() == null) {
            faculty.setDepartment("Computer Science & Engineering");
        }
        if (faculty.getDesignation() == null) {
            faculty.setDesignation("Assistant Professor");
        }
        if (faculty.getStatus() == null) {
            faculty.setStatus("ACTIVE");
        }
        Faculty saved = facultyService.createFaculty(faculty);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Faculty created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaculty(
            @PathVariable Long id, 
            @RequestBody Faculty facultyDetails,
            @RequestHeader(value = "X-User-Sync", required = false) String syncHeader) {
        boolean isSync = "true".equalsIgnoreCase(syncHeader);
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null && facultyDetails.getEmail() != null) {
            faculty = facultyService.getFacultyByEmail(facultyDetails.getEmail());
        }
        if (faculty == null) {
            faculty = new Faculty();
            faculty.setFacultyId(id);
            faculty.setUserId(facultyDetails.getUserId() != null ? facultyDetails.getUserId() : id);
            faculty.setName(facultyDetails.getName() != null ? facultyDetails.getName() : "Faculty");
            faculty.setEmail(facultyDetails.getEmail() != null ? facultyDetails.getEmail() : "faculty@smartlab.com");
            faculty.setDepartment(facultyDetails.getDepartment() != null ? facultyDetails.getDepartment() : "Computer Science & Engineering");
            faculty.setDesignation(facultyDetails.getDesignation() != null ? facultyDetails.getDesignation() : "Assistant Professor");
            faculty.setPhone(facultyDetails.getPhone());
            faculty.setStatus(facultyDetails.getStatus() != null ? facultyDetails.getStatus() : "ACTIVE");
            faculty.setLab(facultyDetails.getLab() != null ? facultyDetails.getLab() : "-");
            Faculty saved = facultyService.createFaculty(faculty);
            return ResponseEntity.ok(ApiResponse.success("Faculty synchronized successfully", saved));
        }

        Faculty updated = facultyService.updateFaculty(faculty.getFacultyId(), facultyDetails, isSync);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found for update"));
        }
        return ResponseEntity.ok(ApiResponse.success("Faculty updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setStatus(status);
        Faculty updated = facultyService.updateFaculty(id, faculty, false);
        return ResponseEntity.ok(ApiResponse.success("Faculty status updated to: " + status, updated));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateFaculty(@PathVariable Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setStatus("ACTIVE");
        Faculty updated = facultyService.updateFaculty(id, faculty, false);
        return ResponseEntity.ok(ApiResponse.success("Faculty activated successfully", updated));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateFaculty(@PathVariable Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setStatus("INACTIVE");
        Faculty updated = facultyService.updateFaculty(id, faculty, false);
        return ResponseEntity.ok(ApiResponse.success("Faculty deactivated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(ApiResponse.success("Faculty deleted successfully"));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<Faculty> all = facultyService.getAllFaculty();
        long total = all.size();
        long active = all.stream().filter(f -> "Active".equalsIgnoreCase(f.getStatus()) || "ACTIVE".equalsIgnoreCase(f.getStatus())).count();
        long inactive = all.stream().filter(f -> "Inactive".equalsIgnoreCase(f.getStatus()) || "INACTIVE".equalsIgnoreCase(f.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("inactive", inactive);
        return ResponseEntity.ok(ApiResponse.success("Faculty statistics computed", stats));
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportFaculty() {
        List<Faculty> all = facultyService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.success("Export complete", all));
    }

    @PostMapping("/import")
    public ResponseEntity<?> importFaculty(@RequestBody List<Faculty> facultyList) {
        List<Faculty> imported = new ArrayList<>();
        for (Faculty f : facultyList) {
            imported.add(facultyService.createFaculty(f));
        }
        return ResponseEntity.ok(ApiResponse.success("Successfully imported " + imported.size() + " faculty records", imported));
    }

    @PostMapping("/{id}/laboratories")
    public ResponseEntity<?> assignLaboratory(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long labId = body.get("labId");
        if (labId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("labId is required"));
        }
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        com.smartlab.entity.Laboratory labEntity = laboratoryService.getLabById(labId);
        if (labEntity == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        faculty.setLab(labEntity.getName());
        Faculty updated = facultyService.updateFaculty(id, faculty, false);
        return ResponseEntity.ok(ApiResponse.success("Laboratory assigned to faculty", updated));
    }

    @DeleteMapping("/{id}/laboratories/{labId}")
    public ResponseEntity<?> removeLaboratory(@PathVariable Long id, @PathVariable Long labId) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setLab("-");
        Faculty updated = facultyService.updateFaculty(id, faculty, false);
        return ResponseEntity.ok(ApiResponse.success("Laboratory removed from faculty", updated));
    }

    @GetMapping("/email/lookup-email")
    public ResponseEntity<?> getFacultyByEmail(@RequestParam String email) {
        Faculty faculty = facultyService.getFacultyByEmail(email);
        if (faculty == null && email != null && !email.trim().isEmpty()) {
            faculty = new Faculty();
            faculty.setEmail(email.toLowerCase().trim());
            String cleanEmail = email.trim();
            String emailPrefix = cleanEmail.contains("@") ? cleanEmail.substring(0, cleanEmail.indexOf("@")) : cleanEmail;
            String prettyName = Character.toUpperCase(emailPrefix.charAt(0)) + emailPrefix.substring(1);
            faculty.setName(prettyName);
            faculty.setDepartment("Computer Science & Engineering");
            faculty.setDesignation("Assistant Professor");
            faculty = facultyService.createFaculty(faculty);
        }
        return ResponseEntity.ok(ApiResponse.success("Faculty looked up by email", faculty));
    }
}
