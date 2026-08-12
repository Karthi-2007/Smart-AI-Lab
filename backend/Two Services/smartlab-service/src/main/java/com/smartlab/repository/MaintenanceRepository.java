package com.smartlab.repository;

import com.smartlab.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByEquipmentEquipmentId(Long equipmentId);
    List<Maintenance> findByEquipmentLaboratoryDepartmentDepartmentId(Long departmentId);
}
