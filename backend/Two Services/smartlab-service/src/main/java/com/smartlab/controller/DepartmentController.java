package com.smartlab.controller;

import com.smartlab.entity.Department;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Laboratory;
import com.smartlab.service.DepartmentService;
import com.smartlab.repository.DepartmentRepository;
import com.smartlab.repository.StudentRepository;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.repository.LaboratoryRepository;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/departments")
public class DepartmentController {
    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final LaboratoryRepository laboratoryRepository;

    public DepartmentController(DepartmentService departmentService,
                                DepartmentRepository departmentRepository,
                                StudentRepository studentRepository,
                                FacultyRepository facultyRepository,
                                LaboratoryRepository laboratoryRepository) {
        this.departmentService = departmentService;
        this.departmentRepository = departmentRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.laboratoryRepository = laboratoryRepository;
    }

    @GetMapping
    public ResponseEntity<?> getDepartments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Specification<Department> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("code")), likePattern)
                ));
            }
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<Department> list = departmentRepository.findAll(spec);
        // Populate counts dynamically
        list.forEach(dept -> {
            Long deptId = dept.getDepartmentId();
            dept.setFacultyCount(facultyRepository.countByDepartmentDepartmentId(deptId));
            dept.setStudentCount(studentRepository.countByDepartmentDepartmentId(deptId));
            dept.setLabCount(laboratoryRepository.countByDepartmentDepartmentId(deptId));
        });
        
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", dept));
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody Department department) {
        if (department.getCode() == null || department.getCode().isBlank()) {
            department.setCode("DEPT-" + System.currentTimeMillis() % 1000);
        }
        if (department.getStatus() == null) {
            department.setStatus("ACTIVE");
        }
        Department saved = departmentService.createDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Department created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Department departmentDetails) {
        Department updated = departmentService.updateDepartment(id, departmentDetails);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found for update"));
        }
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateDepartment(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found"));
        }
        dept.setStatus("ACTIVE");
        Department updated = departmentService.updateDepartment(id, dept);
        return ResponseEntity.ok(ApiResponse.success("Department activated successfully", updated));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateDepartment(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found"));
        }
        dept.setStatus("INACTIVE");
        Department updated = departmentService.updateDepartment(id, dept);
        return ResponseEntity.ok(ApiResponse.success("Department deactivated successfully", updated));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<?> getDepartmentStudents(@PathVariable Long id) {
        List<Student> students = studentRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("department").get("departmentId"), id)
        );
        return ResponseEntity.ok(ApiResponse.success("Students loaded for department ID: " + id, students));
    }

    @GetMapping("/{id}/faculty")
    public ResponseEntity<?> getDepartmentFaculty(@PathVariable Long id) {
        List<Faculty> facultyList = facultyRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("department").get("departmentId"), id)
        );
        return ResponseEntity.ok(ApiResponse.success("Faculty loaded for department ID: " + id, facultyList));
    }

    @GetMapping("/{id}/laboratories")
    public ResponseEntity<?> getDepartmentLaboratories(@PathVariable Long id) {
        List<Laboratory> labs = laboratoryRepository.findByDepartmentDepartmentId(id);
        return ResponseEntity.ok(ApiResponse.success("Laboratories loaded for department ID: " + id, labs));
    }

    @PatchMapping("/{id}/hod")
    public ResponseEntity<?> assignHOD(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String hod = body.get("hod");
        if (hod == null || hod.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("HOD name is required"));
        }
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found"));
        }
        dept.setHod(hod);
        Department updated = departmentService.updateDepartment(id, dept);
        return ResponseEntity.ok(ApiResponse.success("HOD assigned successfully", updated));
    }

    @DeleteMapping("/{id}/hod")
    public ResponseEntity<?> removeHOD(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Department not found"));
        }
        dept.setHod("-");
        Department updated = departmentService.updateDepartment(id, dept);
        return ResponseEntity.ok(ApiResponse.success("HOD removed successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully"));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<Department> depts = departmentService.getAllDepartments();
        long total = depts.size();
        long active = depts.stream().filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus())).count();
        long inactive = depts.stream().filter(d -> "INACTIVE".equalsIgnoreCase(d.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("inactive", inactive);
        return ResponseEntity.ok(ApiResponse.success("Department statistics computed", stats));
    }
}
