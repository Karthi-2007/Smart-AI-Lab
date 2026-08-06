package com.auth.dto;

import java.time.LocalDate;

public class AdminStudentCreateRequest {
    private String name;
    private String email;
    private String regNo;
    private LocalDate dob;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRegNo() { return regNo; }
    public void setRegNo(String regNo) { this.regNo = regNo; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
}
