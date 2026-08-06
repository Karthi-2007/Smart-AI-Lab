package com.smartlab.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EQUIPMENTS")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long equipmentId;

    private String name;
    private String status;

    @ManyToOne
    @JoinColumn(name = "lab_id", nullable = false)
    private Laboratory laboratory;

    public Equipment() {}

    public Equipment(Long equipmentId, String name, String status, Laboratory laboratory) {
        this.equipmentId = equipmentId;
        this.name = name;
        this.status = status;
        this.laboratory = laboratory;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Laboratory getLaboratory() {
        return laboratory;
    }

    public void setLaboratory(Laboratory laboratory) {
        this.laboratory = laboratory;
    }
}
