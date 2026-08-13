package com.smartlab.repository;

import com.smartlab.entity.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface LaboratoryRepository extends JpaRepository<Laboratory, Long>, JpaSpecificationExecutor<Laboratory> {
    List<Laboratory> findByDepartmentDepartmentId(Long departmentId);
    long countByDepartmentDepartmentId(Long departmentId);
}
