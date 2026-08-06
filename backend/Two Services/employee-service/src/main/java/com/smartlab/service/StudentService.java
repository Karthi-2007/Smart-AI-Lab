package com.smartlab.service;

import com.smartlab.entity.Student;
import com.smartlab.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student createStudent(Student student) {
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
            }
            if (studentDetails.getYear() > 0) {
                student.setYear(studentDetails.getYear());
            }
            if (studentDetails.getStatus() != null && !studentDetails.getStatus().isBlank()) {
                student.setStatus(studentDetails.getStatus());
            }
            if (studentDetails.getPhone() != null && !studentDetails.getPhone().isBlank()) {
                student.setPhone(studentDetails.getPhone());
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
}
