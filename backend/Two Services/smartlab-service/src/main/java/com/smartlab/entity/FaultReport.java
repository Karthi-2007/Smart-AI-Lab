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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by_user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private Student reportedBy;

    @Column(name = "reported_by_user_id")
    private Long reportedByUserId;

    private String description;
    private String status;
    private Date reportedAt;
    private String priority = "Low";

    @Column(name = "resolved_at")
    private java.time.LocalDateTime resolvedAt;

    public FaultReport() {}

    public FaultReport(Long faultId, Equipment equipment, Student reportedBy, String description, String status, Date reportedAt, String priority) {
        this.faultId = faultId;
        this.equipment = equipment;
        this.reportedBy = reportedBy;
        this.description = description;
        this.status = status;
        this.reportedAt = reportedAt;
        this.priority = priority;
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
        // Fallback alignment of reportedByUserId to studentId if user_id is not explicitly set
        if (this.reportedByUserId == null) {
            this.reportedByUserId = studentId;
        }
    }

    public void setIssueDescription(String issueDescription) {
        this.description = issueDescription;
    }

    public Long getReportedByUserId() {
        return reportedByUserId;
    }

    public void setReportedByUserId(Long reportedByUserId) {
        this.reportedByUserId = reportedByUserId;
    }

    public java.time.LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(java.time.LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
