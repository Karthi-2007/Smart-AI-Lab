package com.smartlab.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "STUDENT_PROFILES")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

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

    private int year;
    private String section;
    private String status;//Enum

    @Column(name = "reg_no", unique = true, nullable = false)
    private String regNo;

    @Column(name = "phone", length = 20)
    private String phone;

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Student() {}

    public Student(Long studentId, String name, String email, Department department, int year, String status) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.year = year;
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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
        this.department = null;
    }

    public String getDepartmentNameInput() {
        return departmentNameInput;
    }

    public void setDepartmentNameInput(String departmentNameInput) {
        this.departmentNameInput = departmentNameInput;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }
}
