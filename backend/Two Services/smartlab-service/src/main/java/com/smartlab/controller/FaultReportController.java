package com.smartlab.controller;

import com.smartlab.entity.FaultReport;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Equipment;
import com.smartlab.service.FaultReportService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.service.EquipmentService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/faults")
public class FaultReportController {
    private final FaultReportService faultReportService;
    private final StudentService studentService;
    private final FacultyService facultyService;
    private final EquipmentService equipmentService;

    public FaultReportController(FaultReportService faultReportService, 
                                 StudentService studentService, 
                                 FacultyService facultyService,
                                 EquipmentService equipmentService) {
        this.faultReportService = faultReportService;
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public List<FaultReport> getAllFaults() {
        if (SecurityUtils.isAdmin()) {
            return faultReportService.getAllFaults();
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
                return faultReportService.getFaultsByDepartment(faculty.getDepartmentEntity().getDepartmentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found.");
        }

        if (SecurityUtils.isStudent()) {
            Student student = studentService.getStudentByUserId(principal.getUserId());
            if (student == null) {
                student = studentService.getStudentByEmail(principal.getEmail());
            }
            if (student != null) {
                return faultReportService.getFaultsByStudentId(student.getStudentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student profile not found.");
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaultReport> getFaultById(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.notFound().build();
        }

        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }

            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || fault.getReportedBy() == null ||
                    (!student.getStudentId().equals(fault.getReportedBy().getStudentId()) &&
                     !student.getUserId().equals(fault.getReportedByUserId()))) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access this fault report.");
                }
            } else if (SecurityUtils.isFaculty()) {
                checkFaultDepartmentAccess(fault);
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        return ResponseEntity.ok(fault);
    }

    @GetMapping("/student/{studentId}")
    public List<FaultReport> getFaultsByStudentId(@PathVariable Long studentId) {
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }

            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || (!student.getStudentId().equals(studentId) && !student.getUserId().equals(studentId))) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view another student's fault history.");
                }
            } else if (SecurityUtils.isFaculty()) {
                Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                if (faculty == null) {
                    faculty = facultyService.getFacultyByEmail(principal.getEmail());
                }
                if (faculty == null || faculty.getDepartmentEntity() == null) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department not found");
                }
                
                Student requestedStudent = studentService.getStudentById(studentId);
                if (requestedStudent == null) {
                    requestedStudent = studentService.getStudentByUserId(studentId);
                }
                if (requestedStudent == null || requestedStudent.getDepartmentEntity() == null ||
                    !faculty.getDepartmentEntity().getDepartmentId().equals(requestedStudent.getDepartmentEntity().getDepartmentId())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requested student belongs to another department.");
                }
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }
        return faultReportService.getFaultsByStudentId(studentId);
    }

    @PostMapping
    public FaultReport reportFault(@RequestBody FaultReport faultReport) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        Student student = studentService.getStudentByUserId(principal.getUserId());
        if (student == null) {
            student = studentService.getStudentByEmail(principal.getEmail());
        }
        if (student == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student profile not found in database.");
        }

        if (faultReport.getEquipment() == null || faultReport.getEquipment().getEquipmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Equipment ID is required.");
        }

        Equipment equipment = equipmentService.getEquipmentById(faultReport.getEquipment().getEquipmentId());
        if (equipment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found.");
        }

        // Validate department compatibility
        if (student.getDepartmentEntity() != null &&
            equipment.getLaboratory() != null &&
            equipment.getLaboratory().getDepartment() != null) {
            
            Long studentDeptId = student.getDepartmentEntity().getDepartmentId();
            Long equipDeptId = equipment.getLaboratory().getDepartment().getDepartmentId();

            if (!studentDeptId.equals(equipDeptId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Department authorization violation: Student's department does not match the equipment's department.");
            }
        }

        faultReport.setReportedBy(student);
        faultReport.setReportedByUserId(student.getUserId() != null ? student.getUserId() : student.getStudentId());
        faultReport.setEquipment(equipment);

        return faultReportService.reportFault(faultReport);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FaultReport> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.notFound().build();
        }
        checkFaultDepartmentAccess(fault);

        String status = body.get("status");
        FaultReport updated = faultReportService.updateFaultStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<FaultReport> closeFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault == null) {
            return ResponseEntity.notFound().build();
        }
        checkFaultDepartmentAccess(fault);

        FaultReport updated = faultReportService.closeFault(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFault(@PathVariable Long id) {
        FaultReport fault = faultReportService.getFaultById(id);
        if (fault != null) {
            if (!SecurityUtils.isAdmin()) {
                checkFaultDepartmentAccess(fault);
            }
            faultReportService.deleteFault(id);
        }
        return ResponseEntity.noContent().build();
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
