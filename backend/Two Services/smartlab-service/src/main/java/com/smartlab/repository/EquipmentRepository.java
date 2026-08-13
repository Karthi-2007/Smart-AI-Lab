package com.smartlab.repository;

import com.smartlab.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long>, JpaSpecificationExecutor<Equipment> {
    Equipment findByName(String name);
    List<Equipment> findByLaboratoryLabId(Long labId);
    List<Equipment> findByLaboratoryDepartmentDepartmentId(Long departmentId);
    long countByLaboratoryLabId(Long labId);
}
