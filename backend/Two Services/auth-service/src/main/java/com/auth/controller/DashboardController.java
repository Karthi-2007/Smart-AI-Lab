package com.auth.controller;

import com.auth.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JwtUtil jwtUtil;

    public DashboardController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public String dashboard(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "No token provided";
        }

        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);

        switch (role) {
            case "ADMIN":
                return "Welcome Admin! You have full access.";
            case "FACULTY":
                return "Welcome Faculty! Here’s your dashboard.";
            case "STUDENT":
                return "Welcome Student! Here’s your dashboard.";
            default:
                return "Unknown role.";
        }
    }
}
