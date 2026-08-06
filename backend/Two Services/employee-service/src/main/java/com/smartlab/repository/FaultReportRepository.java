package com.smartlab.repository;

import com.smartlab.entity.FaultReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaultReportRepository extends JpaRepository<FaultReport, Long> {
    List<FaultReport> findByEquipmentEquipmentId(Long equipmentId);
    List<FaultReport> findByReportedByStudentId(Long studentId);
}
