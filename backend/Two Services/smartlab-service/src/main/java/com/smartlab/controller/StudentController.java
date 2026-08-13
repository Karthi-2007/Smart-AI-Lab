package com.smartlab.controller;

import com.smartlab.entity.Student;
import com.smartlab.service.StudentService;
import com.smartlab.repository.StudentRepository;
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
@RequestMapping("/api/business/students")
public class StudentController {
    private final StudentService studentService;
    private final StudentRepository studentRepository;

    public StudentController(StudentService studentService, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        
        Specification<Student> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("email")), likePattern),
                    cb.like(cb.lower(root.get("regNo")), likePattern)
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
            if (year != null && year > 0) {
                predicates.add(cb.equal(root.get("year"), year));
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

        Page<Student> resultPage = studentRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", resultPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getStudentsAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getStudents(null, null, null, null, page, size);
    }

    @GetMapping("/active")
    public ResponseEntity<?> getStudentsActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getStudents(null, null, null, "active", page, size);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getStudentsPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getStudents(null, null, null, "pending", page, size);
    }

    @GetMapping("/department/{deptCode}")
    public ResponseEntity<?> getStudentsByDepartmentCode(
            @PathVariable String deptCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getStudents(null, deptCode, null, null, page, size);
    }

    @GetMapping("/year/{yearNum}")
    public ResponseEntity<?> getStudentsByYear(
            @PathVariable Integer yearNum,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return getStudents(null, null, yearNum, null, page, size);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchStudents(@RequestParam String q) {
        return getStudents(q, null, null, null, 0, 1000);
    }

    @GetMapping("/by-year/{year}")
    public ResponseEntity<?> getStudentsByYear(@PathVariable int year) {
        return getStudents(null, null, year, null, 0, 1000);
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getStudentsByStatus(@PathVariable String status) {
        return getStudents(null, null, null, status, 0, 1000);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        if (student.getUserId() == null) {
            student.setUserId(student.getStudentId());
        }
        if (student.getUserId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User ID / Student ID is required"));
        }
        if (student.getDepartment() == null) {
            student.setDepartment("Computer Science & Engineering");
        }
        if (student.getYear() == 0) {
            student.setYear(3);
        }
        if (student.getStatus() == null) {
            student.setStatus("Active");
        }
        Student saved = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Student created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id, 
            @RequestBody Student studentDetails,
            @RequestHeader(value = "X-User-Sync", required = false) String syncHeader) {
        boolean isSync = "true".equalsIgnoreCase(syncHeader);
        Student student = studentService.getStudentById(id);
        if (student == null && studentDetails.getEmail() != null) {
            student = studentService.getStudentByEmail(studentDetails.getEmail());
        }
        if (student == null) {
            student = new Student();
            student.setStudentId(id);
            student.setUserId(studentDetails.getUserId() != null ? studentDetails.getUserId() : id);
            student.setRegNo(studentDetails.getRegNo() != null ? studentDetails.getRegNo() : "REG-" + id);
            student.setName(studentDetails.getName() != null ? studentDetails.getName() : "Student");
            student.setEmail(studentDetails.getEmail() != null ? studentDetails.getEmail() : "student@smartlab.com");
            student.setDepartment(studentDetails.getDepartment() != null ? studentDetails.getDepartment() : "Computer Science & Engineering");
            student.setYear(studentDetails.getYear() > 0 ? studentDetails.getYear() : 3);
            student.setSection(studentDetails.getSection() != null ? studentDetails.getSection() : "A");
            student.setStatus(studentDetails.getStatus() != null ? studentDetails.getStatus() : "Active");
            student.setPhone(studentDetails.getPhone());
            Student saved = studentService.createStudent(student);
            return ResponseEntity.ok(ApiResponse.success("Student synchronized successfully", saved));
        }

        Student updated = studentService.updateStudent(student.getStudentId(), studentDetails, isSync);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student not found for update"));
        }
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student not found"));
        }
        student.setStatus(status);
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(ApiResponse.success("Student status updated to: " + status, updated));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateStudent(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student not found"));
        }
        student.setStatus("Active");
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(ApiResponse.success("Student activated successfully", updated));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateStudent(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Student not found"));
        }
        student.setStatus("Inactive");
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully"));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<Student> all = studentService.getAllStudents();
        long total = all.size();
        long active = all.stream().filter(s -> "Active".equalsIgnoreCase(s.getStatus()) || "ACTIVE".equalsIgnoreCase(s.getStatus())).count();
        long inactive = all.stream().filter(s -> "Inactive".equalsIgnoreCase(s.getStatus()) || "INACTIVE".equalsIgnoreCase(s.getStatus())).count();
        long pending = all.stream().filter(s -> "Pending".equalsIgnoreCase(s.getStatus()) || "PENDING".equalsIgnoreCase(s.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("inactive", inactive);
        stats.put("pending", pending);
        return ResponseEntity.ok(ApiResponse.success("Student statistics computed", stats));
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportStudents() {
        List<Student> all = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Export complete", all));
    }

    @PostMapping("/import")
    public ResponseEntity<?> importStudents(@RequestBody List<Student> students) {
        List<Student> imported = new ArrayList<>();
        for (Student s : students) {
            imported.add(studentService.createStudent(s));
        }
        return ResponseEntity.ok(ApiResponse.success("Successfully imported " + imported.size() + " students", imported));
    }

    @GetMapping("/email/lookup-email")
    public ResponseEntity<?> getStudentByEmail(@RequestParam String email) {
        Student student = studentService.getStudentByEmail(email);
        if (student == null && email != null && !email.trim().isEmpty()) {
            student = new Student();
            student.setEmail(email.toLowerCase().trim());
            String cleanEmail = email.trim();
            String emailPrefix = cleanEmail.contains("@") ? cleanEmail.substring(0, cleanEmail.indexOf("@")) : cleanEmail;
            String prettyName = Character.toUpperCase(emailPrefix.charAt(0)) + emailPrefix.substring(1);
            student.setName(prettyName);
            student.setDepartment("Computer Science & Engineering");
            student.setYear(3);
            student.setStatus("Active");
            student = studentService.createStudent(student);
        }
        return ResponseEntity.ok(ApiResponse.success("Student looked up by email", student));
    }
}
