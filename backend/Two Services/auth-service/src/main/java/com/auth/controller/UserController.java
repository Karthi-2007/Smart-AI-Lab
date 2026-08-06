package com.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Accessible only by ADMIN
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAllUsers() {
        return "Only admins can see all users";
    }

    // Accessible only by FACULTY
    @GetMapping("/faculty-dashboard")
    @PreAuthorize("hasRole('FACULTY')")
    public String facultyDashboard() {
        return "Faculty dashboard content";
    }

    // Accessible only by STUDENT
    @GetMapping("/student-dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public String studentDashboard() {
        return "Student dashboard content";
    }

    // Accessible by both STUDENT and FACULTY
    @GetMapping("/common")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY')")
    public String commonAccess() {
        return "Shared content for students and faculty";
    }
}
