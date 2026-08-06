package com.smartlab.repository;

import com.smartlab.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findByEmail(String email);
    Faculty findByEmailIgnoreCase(String email);
}
