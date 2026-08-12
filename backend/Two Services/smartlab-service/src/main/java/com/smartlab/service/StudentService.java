package com.smartlab.service;

import com.smartlab.entity.Student;
import com.smartlab.entity.Department;
import com.smartlab.repository.StudentRepository;
import com.smartlab.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentService(StudentRepository studentRepository, DepartmentRepository departmentRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
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

    private void resolveDepartment(Student student) {
        String deptName = student.getDepartment();
        if (deptName != null && !deptName.isBlank()) {
            Department dept = findExistingDepartment(deptName);
            if (dept == null) {
                dept = departmentRepository.save(new Department(null, deptName));
            }
            student.setDepartmentEntity(dept);
        }
    }

    public Student createStudent(Student student) {
        // Upsert: if a profile already exists for this userId, update it instead of inserting
        if (student.getUserId() != null) {
            Student existing = studentRepository.findByUserId(student.getUserId());
            if (existing != null) {
                return updateStudent(existing.getStudentId(), student);
            }
        }
        // Upsert: if a profile already exists for this email, update it
        if (student.getEmail() != null) {
            Student existing = studentRepository.findByEmailIgnoreCase(student.getEmail());
            if (existing != null) {
                return updateStudent(existing.getStudentId(), student);
            }
        }
        resolveDepartment(student);
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null && studentDetails.getEmail() != null) {
            student = studentRepository.findByEmail(studentDetails.getEmail());
        }
        if (student != null) {
            if (studentDetails.getName() != null && !studentDetails.getName().isBlank()) {
                student.setName(studentDetails.getName());
            }
            if (studentDetails.getEmail() != null && !studentDetails.getEmail().isBlank()) {
                student.setEmail(studentDetails.getEmail());
            }
            if (studentDetails.getDepartment() != null && !studentDetails.getDepartment().isBlank()) {
                student.setDepartment(studentDetails.getDepartment());
                resolveDepartment(student);
            }
            if (studentDetails.getYear() > 0) {
                student.setYear(studentDetails.getYear());
            }
            if (studentDetails.getSection() != null && !studentDetails.getSection().isBlank()) {
                student.setSection(studentDetails.getSection());
            }
            if (studentDetails.getStatus() != null && !studentDetails.getStatus().isBlank()) {
                student.setStatus(studentDetails.getStatus());
            }
            if (studentDetails.getPhone() != null && !studentDetails.getPhone().isBlank()) {
                student.setPhone(studentDetails.getPhone());
            }
            if (studentDetails.getUserId() != null) {
                student.setUserId(studentDetails.getUserId());
            }
            if (studentDetails.getRegNo() != null && !studentDetails.getRegNo().isBlank()) {
                student.setRegNo(studentDetails.getRegNo());
            }
            return studentRepository.save(student);
        }
        return null;
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student getStudentByEmail(String email) {
        if (email == null) return null;
        Student student = studentRepository.findByEmailIgnoreCase(email.trim());
        if (student == null) {
            student = studentRepository.findByEmail(email.trim());
        }
        return student;
    }

    public Student getStudentByUserId(Long userId) {
        if (userId == null) return null;
        return studentRepository.findByUserId(userId);
    }
}
