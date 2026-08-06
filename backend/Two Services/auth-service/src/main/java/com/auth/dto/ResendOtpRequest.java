package com.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendOtpRequest {
    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}