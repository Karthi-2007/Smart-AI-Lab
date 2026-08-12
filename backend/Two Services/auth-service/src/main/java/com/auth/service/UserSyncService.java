package com.auth.service;

import com.auth.entity.AppUser;
import com.auth.entity.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserSyncService {
    private static final Logger log = LoggerFactory.getLogger(UserSyncService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SMARTLAB_SERVICE_URL = "http://localhost:8082/api/business";

    private final com.auth.security.JwtUtil jwtUtil;

    public UserSyncService(com.auth.security.JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public void syncUser(AppUser user) {
        if (user == null || user.getUserId() == null) return;
        try {
            if (user.getRole() == Role.STUDENT) {
                syncStudent(user);
            } else if (user.getRole() == Role.FACULTY) {
                syncFaculty(user);
            }
        } catch (Exception e) {
            log.error("Failed to sync user {} to smartlab-service: {}", user.getEmail(), e.getMessage());
        }
    }

    private String resolveDepartmentName(AppUser user) {
        String email = user.getEmail() != null ? user.getEmail().toLowerCase() : "";
        String regNo = user.getRegNo() != null ? user.getRegNo().toUpperCase() : "";
        String facultyId = user.getFacultyId() != null ? user.getFacultyId().toUpperCase() : "";

        if (email.contains(".eee") || email.contains("assistant.eee") || 
            regNo.contains("EEE") || facultyId.contains("EEE")) {
            return "Electrical & Electronics Engineering (EEE)";
        }
        if (email.contains(".mech") || email.contains("assistant.mech") || 
            regNo.contains("MECH") || facultyId.contains("MECH")) {
            return "Mechanical Engineering";
        }
        return "Computer Science & Technology / ECE";
    }

    private void syncStudent(AppUser user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("name", user.getName());
        payload.put("email", user.getEmail());
        payload.put("regNo", user.getRegNo());
        payload.put("status", "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "Active" : "Inactive");
        payload.put("department", resolveDepartmentName(user));
        payload.put("year", 3);
        payload.put("section", "A");

        String token = jwtUtil.generateToken("system@smartlab.com", 0L, "ADMIN");
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");

        org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(payload, headers);
        String url = SMARTLAB_SERVICE_URL + "/students/" + user.getUserId();
        restTemplate.exchange(url, org.springframework.http.HttpMethod.PUT, entity, Void.class);
        log.info("Synchronized student profile for {} (ID: {}) to smartlab-service", user.getEmail(), user.getUserId());
    }

    private void syncFaculty(AppUser user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("name", user.getName());
        payload.put("email", user.getEmail());
        payload.put("status", "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "Active" : "Inactive");
        payload.put("department", resolveDepartmentName(user));
        payload.put("designation", "Assistant Professor");

        String token = jwtUtil.generateToken("system@smartlab.com", 0L, "ADMIN");
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");

        org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(payload, headers);
        String url = SMARTLAB_SERVICE_URL + "/faculty/" + user.getUserId();
        restTemplate.exchange(url, org.springframework.http.HttpMethod.PUT, entity, Void.class);
        log.info("Synchronized faculty profile for {} (ID: {}) to smartlab-service", user.getEmail(), user.getUserId());
    }
}
