package com.smartlab.controller;

import com.smartlab.entity.FaultReport;
import com.smartlab.service.FaultReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/faults")
public class FaultReportController {
    private final FaultReportService faultReportService;

    public FaultReportController(FaultReportService faultReportService) {
        this.faultReportService = faultReportService;
    }

    @GetMapping
    public List<FaultReport> getAllFaults() {
        return faultReportService.getAllFaults();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaultReport> getFaultById(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fault);
    }

    @GetMapping("/student/{studentId}")
    public List<FaultReport> getFaultsByStudentId(@PathVariable Long studentId) {
        return faultReportService.getFaultsByStudentId(studentId);
    }

    @PostMapping
    public FaultReport reportFault(@RequestBody FaultReport faultReport) {
        return faultReportService.reportFault(faultReport);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FaultReport> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        FaultReport updated = faultReportService.updateFaultStatus(id, status);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<FaultReport> closeFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.closeFault(id);
        if (fault == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fault);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFault(@PathVariable Long id) {
        faultReportService.deleteFault(id);
        return ResponseEntity.noContent().build();
    }
}
