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

    private Date scheduledAt;
    private String status;
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
        return scheduledAt;
    }

    public void setScheduledAt(Date scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
