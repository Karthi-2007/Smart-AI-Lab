package com.smartlab.repository;

import com.smartlab.entity.FaultReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface FaultReportRepository extends JpaRepository<FaultReport, Long>, JpaSpecificationExecutor<FaultReport> {
    List<FaultReport> findByEquipmentEquipmentId(Long equipmentId);
    List<FaultReport> findByReportedByStudentId(Long studentId);
    List<FaultReport> findByEquipmentLaboratoryDepartmentDepartmentId(Long departmentId);
}
