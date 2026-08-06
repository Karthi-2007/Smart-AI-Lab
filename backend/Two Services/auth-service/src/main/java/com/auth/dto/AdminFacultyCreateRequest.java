package com.auth.dto;

import java.time.LocalDate;

public class AdminFacultyCreateRequest {
    private String name;
    private String email;
    private String facultyId;
    private LocalDate dob;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
}
