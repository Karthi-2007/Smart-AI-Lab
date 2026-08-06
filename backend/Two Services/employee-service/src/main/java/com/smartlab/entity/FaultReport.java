package com.smartlab.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "FAULT_REPORTS")
public class FaultReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faultId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private Student reportedBy;

    private String description;
    private String status;
    private Date reportedAt;

    public FaultReport() {}

    public FaultReport(Long faultId, Equipment equipment, Student reportedBy, String description, String status, Date reportedAt) {
        this.faultId = faultId;
        this.equipment = equipment;
        this.reportedBy = reportedBy;
        this.description = description;
        this.status = status;
        this.reportedAt = reportedAt;
    }

    public Long getFaultId() {
        return faultId;
    }

    public void setFaultId(Long faultId) {
        this.faultId = faultId;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public Student getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(Student reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(Date reportedAt) {
        this.reportedAt = reportedAt;
    }

    public void setEquipmentId(Long equipmentId) {
        if (this.equipment == null) {
            this.equipment = new Equipment();
        }
        this.equipment.setEquipmentId(equipmentId);
    }

    public void setStudentId(Long studentId) {
        if (this.reportedBy == null) {
            this.reportedBy = new Student();
        }
        this.reportedBy.setStudentId(studentId);
    }

    public void setIssueDescription(String issueDescription) {
        this.description = issueDescription;
    }
}
