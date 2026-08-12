package com.smartlab.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "FACULTY_PROFILES")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long facultyId;

    @Column(name = "user_id", unique = true)
    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Department department;

    @Transient
    private String departmentNameInput;

    private String designation;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "lab", length = 100)
    private String lab;

    @Column(name = "phone", length = 20)
    private String phone;

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Faculty() {}

    public Faculty(Long facultyId, String name, String email, Department department, String designation) {
        this.facultyId = facultyId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Department getDepartmentEntity() {
        return department;
    }

    public void setDepartmentEntity(Department department) {
        this.department = department;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("department")
    public String getDepartment() {
        return department != null ? department.getName() : departmentNameInput;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("department")
    public void setDepartment(String departmentName) {
        this.departmentNameInput = departmentName;
    }

    public String getDepartmentNameInput() {
        return departmentNameInput;
    }

    public void setDepartmentNameInput(String departmentNameInput) {
        this.departmentNameInput = departmentNameInput;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLab() {
        return lab;
    }

    public void setLab(String lab) {
        this.lab = lab;
    }
}
