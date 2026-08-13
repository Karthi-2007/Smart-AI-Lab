package com.smartlab.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "LABORATORIES")
public class Laboratory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labId;

    private String name;
    private String location;
    private int capacity;
    private String status;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = true)
    private Department department;

    public Laboratory() {}

    public Laboratory(Long labId, String name, String location, Department department) {
        this.labId = labId;
        this.name = name;
        this.location = location;
        this.department = department;
    }

    public Long getLabId() {
        return labId;
    }

    public void setLabId(Long labId) {
        this.labId = labId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Transient
    private int equipmentCount;

    public int getEquipmentCount() {
        return equipmentCount;
    }

    public void setEquipmentCount(int equipmentCount) {
        this.equipmentCount = equipmentCount;
    }
}
