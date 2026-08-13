package com.smartlab.repository;

import com.smartlab.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long>, JpaSpecificationExecutor<Maintenance> {
    List<Maintenance> findByEquipmentEquipmentId(Long equipmentId);
    List<Maintenance> findByEquipmentLaboratoryDepartmentDepartmentId(Long departmentId);
}
