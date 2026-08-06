package com.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentController {

    @GetMapping("/api/student/me")
    public Object studentMe(Authentication authentication) {
        return new UserResponse(
                authentication.getName(),
                authentication.getAuthorities().toString(),
                "You are logged in as Student"
        );
    }

    record UserResponse(String email, String roles, String message) {}
}
