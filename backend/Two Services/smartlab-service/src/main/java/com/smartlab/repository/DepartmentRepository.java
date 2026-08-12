package com.smartlab.repository;

import com.smartlab.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findByName(String name);
    Department findByCode(String code);
}
