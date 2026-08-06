package com.smartlab.repository;

import com.smartlab.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByEmail(String email);
    Student findByEmailIgnoreCase(String email);
}
