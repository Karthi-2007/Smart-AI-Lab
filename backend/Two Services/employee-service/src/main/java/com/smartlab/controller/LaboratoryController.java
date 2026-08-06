package com.smartlab.controller;

import com.smartlab.entity.Laboratory;
import com.smartlab.service.LaboratoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/laboratories")
public class LaboratoryController {
    private final LaboratoryService laboratoryService;

    public LaboratoryController(LaboratoryService laboratoryService) {
        this.laboratoryService = laboratoryService;
    }

    @GetMapping
    public List<Laboratory> getAllLabs() {
        return laboratoryService.getAllLabs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Laboratory> getLabById(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lab);
    }

    @PostMapping
    public Laboratory createLab(@RequestBody Laboratory lab) {
        return laboratoryService.createLab(lab);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Laboratory> updateLab(@PathVariable Long id, @RequestBody Laboratory labDetails) {
        Laboratory updated = laboratoryService.updateLab(id, labDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLab(@PathVariable Long id) {
        laboratoryService.deleteLab(id);
        return ResponseEntity.noContent().build();
    }
}
