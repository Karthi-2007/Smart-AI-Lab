package com.smartlab.repository;

import com.smartlab.entity.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LaboratoryRepository extends JpaRepository<Laboratory, Long> {
    List<Laboratory> findByDepartmentDepartmentId(Long departmentId);
}
