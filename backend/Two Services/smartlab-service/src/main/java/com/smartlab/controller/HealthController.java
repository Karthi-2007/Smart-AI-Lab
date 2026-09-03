package com.smartlab.controller;

import com.smartlab.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping({"/health", "/api/business/health"})
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);
    private final DepartmentRepository departmentRepository;

    public HealthController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> health() {
        boolean dbHealthy = false;
        try {
            long count = departmentRepository.count();
            dbHealthy = count >= 0;
        } catch (Exception e) {
            log.error("SmartLab DB Health Check Failed: {}", e.getMessage());
        }

        Map<String, Object> status = Map.of(
            "status", dbHealthy ? "UP" : "DOWN",
            "service", "smartlab-service",
            "database", dbHealthy ? "CONNECTED" : "DISCONNECTED"
        );

        return dbHealthy ? ResponseEntity.ok(status) : ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
    }
}
