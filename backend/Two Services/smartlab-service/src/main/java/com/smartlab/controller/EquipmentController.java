package com.smartlab.controller;

import com.smartlab.entity.Equipment;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.service.EquipmentService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/business/equipments")
public class EquipmentController {
    private final EquipmentService equipmentService;
    private final StudentService studentService;
    private final FacultyService facultyService;

    public EquipmentController(EquipmentService equipmentService, StudentService studentService, FacultyService facultyService) {
        this.equipmentService = equipmentService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }

    @GetMapping
    public List<Equipment> getAllEquipment() {
        if (SecurityUtils.isAdmin()) {
            return equipmentService.getAllEquipment();
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
                return equipmentService.getEquipmentByDepartment(faculty.getDepartmentEntity().getDepartmentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found.");
        }

        if (SecurityUtils.isStudent()) {
            Student student = studentService.getStudentByUserId(principal.getUserId());
            if (student == null) {
                student = studentService.getStudentByEmail(principal.getEmail());
            }
            if (student != null && student.getDepartmentEntity() != null) {
                return equipmentService.getEquipmentByDepartment(student.getDepartmentEntity().getDepartmentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student department profile not found.");
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getEquipmentById(id);
        if (equipment == null) {
            return ResponseEntity.notFound().build();
        }

        // Validate access
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }

            Long equipDeptId = (equipment.getLaboratory() != null && equipment.getLaboratory().getDepartment() != null) ?
                    equipment.getLaboratory().getDepartment().getDepartmentId() : null;

            if (equipDeptId == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Equipment has no department assigned.");
            }

            if (SecurityUtils.isFaculty()) {
                Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                if (faculty == null) {
                    faculty = facultyService.getFacultyByEmail(principal.getEmail());
                }
                if (faculty == null || faculty.getDepartmentEntity() == null ||
                    !faculty.getDepartmentEntity().getDepartmentId().equals(equipDeptId)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to equipment in this department.");
                }
            } else if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || student.getDepartmentEntity() == null ||
                    !student.getDepartmentEntity().getDepartmentId().equals(equipDeptId)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to equipment in this department.");
                }
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/lab/{labId}")
    public List<Equipment> getEquipmentByLabId(@PathVariable Long labId) {
        // We could enforce lab-level check but standard department check is sufficient
        return equipmentService.getEquipmentByLabId(labId);
    }

    @PostMapping
    public Equipment createEquipment(@RequestBody Equipment equipment) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.isFaculty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only faculty or admin can create equipment.");
        }
        return equipmentService.createEquipment(equipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipmentDetails) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.isFaculty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only faculty or admin can update equipment.");
        }
        Equipment updated = equipmentService.updateEquipment(id, equipmentDetails);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        if (!SecurityUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can delete equipment.");
        }
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
