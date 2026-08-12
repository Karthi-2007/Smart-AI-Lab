package com.smartlab.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "DEPARTMENTS")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(unique = true, length = 50)
    private String code;

    @Column(name = "hod", length = 100)
    private String hod;

    @Column(name = "status", length = 20)
    private String status;

    @Transient
    private Long facultyCount;

    @Transient
    private Long studentCount;

    @Transient
    private Long labCount;

    public Department() {}

    public Department(Long departmentId, String name) {
        this.departmentId = departmentId;
        this.name = name;
    }

    public Department(Long departmentId, String name, String code) {
        this.departmentId = departmentId;
        this.name = name;
        this.code = code;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getHod() {
        return hod;
    }

    public void setHod(String hod) {
        this.hod = hod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getFacultyCount() {
        return facultyCount;
    }

    public void setFacultyCount(Long facultyCount) {
        this.facultyCount = facultyCount;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }

    public Long getLabCount() {
        return labCount;
    }

    public void setLabCount(Long labCount) {
        this.labCount = labCount;
    }
}
