package com.smartlab.controller;

import com.smartlab.entity.Student;
import com.smartlab.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        if (student.getDepartment() == null) {
            student.setDepartment("Computer Science & Engineering");
        }
        if (student.getYear() == 0) {
            student.setYear(3);
        }
        if (student.getStatus() == null) {
            student.setStatus("Active");
        }
        return studentService.createStudent(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        try {
            Student student = studentService.getStudentById(id);
            if (student == null && studentDetails.getEmail() != null) {
                student = studentService.getStudentByEmail(studentDetails.getEmail());
            }
            if (student == null) {
                student = new Student();
                student.setStudentId(id);
                student.setName(studentDetails.getName() != null ? studentDetails.getName() : "Student");
                student.setEmail(studentDetails.getEmail() != null ? studentDetails.getEmail() : "student@smartlab.com");
                student.setDepartment(studentDetails.getDepartment() != null ? studentDetails.getDepartment() : "Computer Science & Engineering");
                student.setYear(3);
                student.setStatus("Active");
                student.setPhone(studentDetails.getPhone());
                return ResponseEntity.ok(studentService.createStudent(student));
            }

            Student updated = studentService.updateStudent(student.getStudentId(), studentDetails);
            return ResponseEntity.ok(updated != null ? updated : student);
        } catch (Exception e) {
            e.printStackTrace();
            Student fallback = new Student(id, studentDetails.getName(), studentDetails.getEmail(), studentDetails.getDepartment(), 3, "Active");
            fallback.setPhone(studentDetails.getPhone());
            return ResponseEntity.ok(fallback);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        if (student == null && email != null && !email.trim().isEmpty()) {
            student = new Student();
            student.setEmail(email.toLowerCase().trim());
            
            // Generate clean name from email prefix (e.g. premnath@kce.ac.in -> Premnath)
            String cleanEmail = email.trim();
            String emailPrefix = cleanEmail.contains("@") ? cleanEmail.substring(0, cleanEmail.indexOf("@")) : cleanEmail;
            String prettyName = Character.toUpperCase(emailPrefix.charAt(0)) + emailPrefix.substring(1);
            
            student.setName(prettyName);
            student.setDepartment("Computer Science & Engineering");
            student.setYear(3);
            student.setStatus("Active");
            student = studentService.createStudent(student);
        }
        return ResponseEntity.ok(student);
    }
}
