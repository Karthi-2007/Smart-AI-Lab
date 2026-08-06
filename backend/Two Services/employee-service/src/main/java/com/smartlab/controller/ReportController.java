package com.smartlab.controller;

import com.smartlab.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/business/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummaryReport() {
        return reportService.getSummaryReport();
    }

    @GetMapping("/equipment-usage")
    public Map<String, Object> getEquipmentUsageReport() {
        return reportService.getEquipmentUsageReport();
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalyticsReport() {
        return reportService.getAnalyticsReport();
    }
}
