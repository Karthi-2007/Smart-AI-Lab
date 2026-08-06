package com.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FacultyController {

    @GetMapping("/api/faculty/me")
    public Object facultyMe(Authentication authentication) {
        return new UserResponse(
                authentication.getName(),
                authentication.getAuthorities().toString(),
                "You are logged in as Faculty"
        );
    }

    record UserResponse(String email, String roles, String message) {}
}
