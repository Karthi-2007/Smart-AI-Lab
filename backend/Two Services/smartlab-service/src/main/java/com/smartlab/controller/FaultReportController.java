package com.smartlab.controller;

import com.smartlab.entity.FaultReport;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Equipment;
import com.smartlab.service.FaultReportService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.service.EquipmentService;
import com.smartlab.repository.FaultReportRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/faults")
public class FaultReportController {
    private final FaultReportService faultReportService;
    private final FaultReportRepository faultReportRepository;
    private final StudentService studentService;
    private final FacultyService facultyService;
    private final EquipmentService equipmentService;

    public FaultReportController(FaultReportService faultReportService, 
                                 FaultReportRepository faultReportRepository,
                                 StudentService studentService, 
                                 FacultyService facultyService,
                                 EquipmentService equipmentService) {
        this.faultReportService = faultReportService;
        this.faultReportRepository = faultReportRepository;
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<?> getFaults(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("reportedAt").descending());

        Specification<FaultReport> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("description")), likePattern),
                    cb.like(cb.lower(root.get("equipment").get("name")), likePattern)
                ));
            }
            if (status != null && !status.trim().isEmpty() && !"All".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            if (priority != null && !priority.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("priority")), priority.trim().toLowerCase()));
            }
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), departmentId));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<FaultReport> faultPage = faultReportRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("Fault reports retrieved successfully", faultPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFaultById(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
            }
            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || fault.getReportedBy() == null ||
                    (!student.getStudentId().equals(fault.getReportedBy().getStudentId()) &&
                     !student.getUserId().equals(fault.getReportedByUserId()))) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot access this fault report."));
                }
            } else if (SecurityUtils.isFaculty()) {
                checkFaultDepartmentAccess(fault);
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Fault report retrieved successfully", fault));
    }

    @GetMapping({"/student/{studentId}", "/student/{studentId}/faults-list"})
    public ResponseEntity<?> getFaultsByStudentId(@PathVariable Long studentId) {
        List<FaultReport> list = faultReportService.getFaultsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fault reports retrieved for student ID: " + studentId, list));
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<?> getFaultsByEquipmentId(@PathVariable Long equipmentId) {
        List<FaultReport> list = faultReportRepository.findByEquipmentEquipmentId(equipmentId);
        return ResponseEntity.ok(ApiResponse.success("Fault reports retrieved for equipment ID: " + equipmentId, list));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFaults(@RequestParam String q) {
        return getFaults(q, null, null, null, 0, 1000);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterFaults(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long departmentId) {
        return getFaults(null, status, priority, departmentId, 0, 1000);
    }

    @GetMapping("/faculty/my-reports")
    public ResponseEntity<?> getFacultyFaultReports(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long laboratoryId,
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {

        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyService.getFacultyByEmail(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty department profile not found in database."));
        }

        Long facDeptId = faculty.getDepartmentEntity().getDepartmentId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("reportedAt").descending());

        Specification<FaultReport> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), facDeptId));

            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("description")), likePattern),
                    cb.like(cb.lower(root.get("equipment").get("name")), likePattern),
                    cb.like(cb.lower(root.get("reportedBy").get("name")), likePattern),
                    cb.like(cb.lower(root.get("reportedBy").get("registerNumber")), likePattern)
                ));
            }
            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            if (priority != null && !priority.trim().isEmpty() && !"ALL".equalsIgnoreCase(priority)) {
                predicates.add(cb.equal(cb.lower(root.get("priority")), priority.trim().toLowerCase()));
            }
            if (laboratoryId != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("laboratoryId"), laboratoryId));
            }
            if (equipmentId != null) {
                predicates.add(cb.equal(root.get("equipment").get("equipmentId"), equipmentId));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<FaultReport> faultPage = faultReportRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("Faculty fault reports retrieved successfully", faultPage));
    }

    @GetMapping("/faculty/summary")
    public ResponseEntity<?> getFacultyFaultSummary() {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyService.getFacultyByEmail(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Faculty department profile not found in database."));
        }

        Long facDeptId = faculty.getDepartmentEntity().getDepartmentId();

        List<FaultReport> list = faultReportRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), facDeptId)
        );

        long totalFaults = list.size();
        long openFaults = list.stream().filter(f -> "Open".equalsIgnoreCase(f.getStatus()) || "Reported".equalsIgnoreCase(f.getStatus())).count();
        long inProgressFaults = list.stream().filter(f -> "In Progress".equalsIgnoreCase(f.getStatus()) || "Assigned".equalsIgnoreCase(f.getStatus()) || "Under Review".equalsIgnoreCase(f.getStatus())).count();
        long resolvedFaults = list.stream().filter(f -> "Resolved".equalsIgnoreCase(f.getStatus()) || "Closed".equalsIgnoreCase(f.getStatus()) || "Completed".equalsIgnoreCase(f.getStatus())).count();
        long criticalHighFaults = list.stream().filter(f -> "Critical".equalsIgnoreCase(f.getPriority()) || "High".equalsIgnoreCase(f.getPriority())).count();
        long pendingReviewFaults = list.stream().filter(f -> "Reported".equalsIgnoreCase(f.getStatus()) || "Open".equalsIgnoreCase(f.getStatus()) || "Under Review".equalsIgnoreCase(f.getStatus())).count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalFaults", totalFaults);
        summary.put("openFaults", openFaults);
        summary.put("inProgressFaults", inProgressFaults);
        summary.put("resolvedFaults", resolvedFaults);
        summary.put("criticalHighFaults", criticalHighFaults);
        summary.put("pendingReviewFaults", pendingReviewFaults);

        return ResponseEntity.ok(ApiResponse.success("Faculty fault summary retrieved successfully", summary));
    }

    @PostMapping
    public ResponseEntity<?> reportFault(@RequestBody FaultReport faultReport) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Student student = studentService.getStudentByUserId(principal.getUserId());
        if (student == null) {
            student = studentService.getStudentByEmail(principal.getEmail());
        }
        if (student == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Student profile not found."));
        }

        if (faultReport.getEquipment() == null || faultReport.getEquipment().getEquipmentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Equipment ID is required."));
        }

        Equipment equipment = equipmentService.getEquipmentById(faultReport.getEquipment().getEquipmentId());
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found."));
        }

        // Validate department compatibility
        if (student.getDepartmentEntity() != null &&
            equipment.getLaboratory() != null &&
            equipment.getLaboratory().getDepartment() != null) {
            
            Long studentDeptId = student.getDepartmentEntity().getDepartmentId();
            Long equipDeptId = equipment.getLaboratory().getDepartment().getDepartmentId();

            if (!studentDeptId.equals(equipDeptId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Department authorization violation."));
            }
        }

        faultReport.setReportedBy(student);
        faultReport.setReportedByUserId(student.getUserId() != null ? student.getUserId() : student.getStudentId());
        faultReport.setEquipment(equipment);
        if (faultReport.getStatus() == null) {
            faultReport.setStatus("Open");
        }
        if (faultReport.getReportedAt() == null) {
            faultReport.setReportedAt(new java.util.Date());
        }

        FaultReport saved = faultReportService.reportFault(faultReport);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Fault reported successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFault(@PathVariable Long id, @RequestBody FaultReport details) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        checkFaultDepartmentAccess(fault);
        
        if (details.getDescription() != null) fault.setDescription(details.getDescription());
        if (details.getPriority() != null) fault.setPriority(details.getPriority());
        if (details.getStatus() != null) fault.setStatus(details.getStatus());

        FaultReport updated = faultReportRepository.save(fault);
        return ResponseEntity.ok(ApiResponse.success("Fault report updated successfully", updated));
    }

    @RequestMapping(value = "/{id}/assign", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> assignFault(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        checkFaultDepartmentAccess(fault);
        
        String assignee = body != null ? body.get("assignee") : "Technician";
        fault.setStatus("In Progress");
        if (fault.getDescription() != null && !fault.getDescription().contains("Assigned to")) {
            fault.setDescription(fault.getDescription() + " (Assigned to: " + assignee + ")");
        }
        FaultReport updated = faultReportService.updateFaultStatus(id, "In Progress");
        if (updated != null) {
            updated.setDescription(fault.getDescription());
            faultReportRepository.save(updated);
        }
        return ResponseEntity.ok(ApiResponse.success("Fault report assigned to " + assignee, updated));
    }

    @RequestMapping(value = "/{id}/resolve", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> resolveFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        checkFaultDepartmentAccess(fault);
        FaultReport updated = faultReportService.closeFault(id);
        return ResponseEntity.ok(ApiResponse.success("Fault report resolved successfully", updated));
    }

    @RequestMapping(value = "/{id}/reject", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> rejectFault(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        checkFaultDepartmentAccess(fault);
        String reason = body != null ? body.get("reason") : "No reason specified";
        fault.setStatus("Rejected");
        if (fault.getDescription() != null) {
            fault.setDescription(fault.getDescription() + " (Rejected reason: " + reason + ")");
        }
        FaultReport updated = faultReportService.updateFaultStatus(id, "Rejected");
        if (updated != null) {
            updated.setDescription(fault.getDescription());
            faultReportRepository.save(updated);
        }
        return ResponseEntity.ok(ApiResponse.success("Fault report rejected", updated));
    }

    @RequestMapping(value = "/{id}/cancel", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> cancelFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
            }
            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || fault.getReportedBy() == null ||
                    (!student.getStudentId().equals(fault.getReportedBy().getStudentId()) &&
                     !student.getUserId().equals(fault.getReportedByUserId()))) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot cancel another user's fault report."));
                }
            } else if (SecurityUtils.isFaculty()) {
                checkFaultDepartmentAccess(fault);
            }
        }
        
        FaultReport updated = faultReportService.updateFaultStatus(id, "Cancelled");
        return ResponseEntity.ok(ApiResponse.success("Fault report cancelled", updated));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("status is required"));
        }
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Fault report not found"));
        }
        checkFaultDepartmentAccess(fault);
        FaultReport updated = faultReportService.updateFaultStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Fault report status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault != null) {
            if (!SecurityUtils.isAdmin()) {
                checkFaultDepartmentAccess(fault);
            }
            faultReportService.deleteFault(id);
        }
        return ResponseEntity.ok(ApiResponse.success("Fault report deleted successfully"));
    }

    private void checkFaultDepartmentAccess(FaultReport fault) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
        if (faculty == null) {
            faculty = facultyService.getFacultyByEmail(principal.getEmail());
        }
        if (faculty == null || faculty.getDepartmentEntity() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found in database.");
        }

        Long facDeptId = faculty.getDepartmentEntity().getDepartmentId();
        boolean equipDeptMatches = fault.getEquipment() != null &&
                                   fault.getEquipment().getLaboratory() != null &&
                                   fault.getEquipment().getLaboratory().getDepartment() != null &&
                                   facDeptId.equals(fault.getEquipment().getLaboratory().getDepartment().getDepartmentId());

        if (!equipDeptMatches) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Department authorization violation: Fault report does not belong to your department.");
        }
    }
}
