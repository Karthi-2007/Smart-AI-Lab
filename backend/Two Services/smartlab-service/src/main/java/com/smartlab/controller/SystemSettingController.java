package com.smartlab.controller;

import com.smartlab.dto.ApiResponse;
import com.smartlab.entity.SystemSetting;
import com.smartlab.service.SystemSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business/settings")
public class SystemSettingController {

    @Autowired
    private SystemSettingService service;

    @GetMapping
    public ResponseEntity<?> getSettings() {
        SystemSetting settings = service.getSettings();
        return ResponseEntity.ok(ApiResponse.success("System settings retrieved successfully", settings));
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody SystemSetting request) {
        SystemSetting updated = service.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", updated));
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateSettings(@RequestBody SystemSetting request) {
        SystemSetting updated = service.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", updated));
    }
}
