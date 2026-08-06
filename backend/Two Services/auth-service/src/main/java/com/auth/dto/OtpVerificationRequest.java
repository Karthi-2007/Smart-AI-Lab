package com.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OtpVerificationRequest {
	
	@NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    private String email;
	
	@NotNull(message = "OTP is required")
    private String otp;
    
    @NotNull(message = "newPassword is required")
    private String newPassword;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
