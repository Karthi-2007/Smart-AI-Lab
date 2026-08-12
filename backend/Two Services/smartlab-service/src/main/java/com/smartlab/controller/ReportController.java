package com.smartlab.controller;

import com.smartlab.entity.Faculty;
import com.smartlab.service.ReportService;
import com.smartlab.service.FacultyService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/business/reports")
public class ReportController {
    private final ReportService reportService;
    private final FacultyService facultyService;

    public ReportController(ReportService reportService, FacultyService facultyService) {
        this.reportService = reportService;
        this.facultyService = facultyService;
    }

    private Long getDepartmentFilter() {
        if (SecurityUtils.isAdmin()) {
            return null; // Admin can view all
        }
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (SecurityUtils.isFaculty()) {
            Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
            if (faculty == null) {
                faculty = facultyService.getFacultyByEmail(principal.getEmail());
            }
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                return faculty.getDepartmentEntity().getDepartmentId();
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found.");
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummaryReport() {
        return reportService.getSummaryReport(getDepartmentFilter());
    }

    @GetMapping("/equipment-usage")
    public Map<String, Object> getEquipmentUsageReport() {
        return reportService.getEquipmentUsageReport(getDepartmentFilter());
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalyticsReport() {
        return reportService.getAnalyticsReport(getDepartmentFilter());
    }
}
