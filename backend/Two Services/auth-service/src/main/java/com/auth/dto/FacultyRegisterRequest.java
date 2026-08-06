package com.auth.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FacultyRegisterRequest {
	@NotBlank(message = "facultyID  is required")
    private String facultyId;
	
	@NotBlank(message = "email is required")
	@Email(message = "email must be valid")
    private String email;
	
	@NotNull(message = "dob is required")
    private LocalDate dob;
	
    private String name;

    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

