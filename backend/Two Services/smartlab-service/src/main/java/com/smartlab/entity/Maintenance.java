package com.smartlab.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "MAINTENANCE")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maintenanceId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "assigned_to_user_id")
    private Long assignedToUserId;

    private String description;
    private String status;

    @Column(name = "scheduled_date")
    private java.time.LocalDate scheduledDate;

    @Column(name = "completed_date")
    private java.time.LocalDate completedDate;

    @Column(name = "type")
    private String type;

    @Transient
    private String technician;

    @Transient
    private Date scheduledAt;

    @Transient
    private String notes;

    public Maintenance() {}

    public Maintenance(Long maintenanceId, Equipment equipment, Date scheduledAt, String status, String notes) {
        this.maintenanceId = maintenanceId;
        this.equipment = equipment;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.notes = notes;
    }

    public Long getMaintenanceId() {
        return maintenanceId;
    }

    public void setMaintenanceId(Long maintenanceId) {
        this.maintenanceId = maintenanceId;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public Date getScheduledAt() {
        if (scheduledDate != null) {
            return java.sql.Date.valueOf(scheduledDate);
        }
        return scheduledAt;
    }

    public void setScheduledAt(Date scheduledAt) {
        this.scheduledAt = scheduledAt;
        if (scheduledAt != null) {
            this.scheduledDate = new java.sql.Date(scheduledAt.getTime()).toLocalDate();
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return description != null ? description : notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
        this.description = notes;
    }

    public Long getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(Long assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public java.time.LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(java.time.LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public java.time.LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(java.time.LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTechnician() {
        return technician;
    }

    public void setTechnician(String technician) {
        this.technician = technician;
    }
}
