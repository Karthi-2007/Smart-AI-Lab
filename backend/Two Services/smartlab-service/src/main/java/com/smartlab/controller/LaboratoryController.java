package com.smartlab.controller;

import com.smartlab.entity.Laboratory;
import com.smartlab.entity.Equipment;
import com.smartlab.entity.Booking;
import com.smartlab.entity.Faculty;
import com.smartlab.service.LaboratoryService;
import com.smartlab.service.FacultyService;
import com.smartlab.service.StudentService;
import com.smartlab.repository.LaboratoryRepository;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/laboratories")
public class LaboratoryController {
    private final LaboratoryService laboratoryService;
    private final LaboratoryRepository laboratoryRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final FacultyRepository facultyRepository;
    private final FacultyService facultyService;
    private final StudentService studentService;

    public LaboratoryController(LaboratoryService laboratoryService,
                                LaboratoryRepository laboratoryRepository,
                                EquipmentRepository equipmentRepository,
                                BookingRepository bookingRepository,
                                FacultyRepository facultyRepository,
                                FacultyService facultyService,
                                StudentService studentService) {
        this.laboratoryService = laboratoryService;
        this.laboratoryRepository = laboratoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
        this.facultyRepository = facultyRepository;
        this.facultyService = facultyService;
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<?> getLaboratories(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {
        try {
            Long enforcedDeptId = departmentId;
            if (!SecurityUtils.isAdmin()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal != null) {
                    if (SecurityUtils.isFaculty()) {
                        Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                        if (faculty == null) faculty = facultyService.getFacultyByEmail(principal.getEmail());
                        if (faculty != null && faculty.getDepartmentEntity() != null) {
                            enforcedDeptId = faculty.getDepartmentEntity().getDepartmentId();
                        }
                    } else if (SecurityUtils.isStudent()) {
                        com.smartlab.entity.Student student = studentService.getStudentByUserId(principal.getUserId());
                        if (student == null) student = studentService.getStudentByEmail(principal.getEmail());
                        if (student != null && student.getDepartmentEntity() != null) {
                            enforcedDeptId = student.getDepartmentEntity().getDepartmentId();
                        }
                    }
                }
            }

            final Long finalDeptId = enforcedDeptId;
            final String finalSearch = search;
            final String finalStatus = status;
            Specification<Laboratory> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                if (finalSearch != null && !finalSearch.trim().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + finalSearch.trim().toLowerCase() + "%"));
                }
                if (finalDeptId != null) {
                    predicates.add(cb.equal(root.get("department").get("departmentId"), finalDeptId));
                }
                if (finalStatus != null && !finalStatus.trim().isEmpty()) {
                    predicates.add(cb.equal(cb.lower(root.get("status")), finalStatus.trim().toLowerCase()));
                }
                return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            };

            List<Laboratory> labs = laboratoryRepository.findAll(spec);
            labs.forEach(lab -> {
                try {
                    lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
                } catch (Exception ignored) {}
            });
            return ResponseEntity.ok(ApiResponse.success("Laboratories retrieved successfully", labs));
        } catch (Exception e) {
            List<Laboratory> all = laboratoryRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success("Laboratories retrieved successfully", all));
        }
    }

    @GetMapping("/my-labs")
    public ResponseEntity<?> getMyLabs(@RequestParam(required = false) String search) {
        try {
            Long deptId = null;
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                if (SecurityUtils.isFaculty()) {
                    Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                    if (faculty == null) faculty = facultyService.getFacultyByEmail(principal.getEmail());
                    if (faculty != null && faculty.getDepartmentEntity() != null) {
                        deptId = faculty.getDepartmentEntity().getDepartmentId();
                    }
                } else if (SecurityUtils.isStudent()) {
                    com.smartlab.entity.Student student = studentService.getStudentByUserId(principal.getUserId());
                    if (student == null) student = studentService.getStudentByEmail(principal.getEmail());
                    if (student != null && student.getDepartmentEntity() != null) {
                        deptId = student.getDepartmentEntity().getDepartmentId();
                    }
                }
            }

            final Long finalDeptId = deptId;
            final String finalSearch = search;
            Specification<Laboratory> spec = (root, query, cb) -> {
                List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
                if (finalDeptId != null) {
                    predicates.add(cb.equal(root.get("department").get("departmentId"), finalDeptId));
                }
                if (finalSearch != null && !finalSearch.trim().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + finalSearch.trim().toLowerCase() + "%"));
                }
                return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            };

            List<Laboratory> labs = laboratoryRepository.findAll(spec);
            labs.forEach(lab -> {
                try {
                    lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
                } catch (Exception ignored) {}
            });
            return ResponseEntity.ok(ApiResponse.success("My laboratories retrieved successfully", labs));
        } catch (Exception e) {
            List<Laboratory> all = laboratoryRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success("Laboratories retrieved successfully", all));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLabById(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        lab.setEquipmentCount((int) equipmentRepository.countByLaboratoryLabId(lab.getLabId()));
        return ResponseEntity.ok(ApiResponse.success("Laboratory retrieved successfully", lab));
    }

    @GetMapping("/by-department/{departmentCode}")
    public ResponseEntity<?> getLabsByDepartmentCode(@PathVariable String departmentCode) {
        // Look up by department code name
        Specification<Laboratory> spec = (root, query, cb) -> 
            cb.like(cb.lower(root.get("department").get("name")), "%" + departmentCode.trim().toLowerCase() + "%");
        List<Laboratory> labs = laboratoryRepository.findAll(spec);
        return ResponseEntity.ok(ApiResponse.success("Laboratories loaded for department: " + departmentCode, labs));
    }

    @PostMapping
    public ResponseEntity<?> createLab(@RequestBody Laboratory lab) {
        if (!SecurityUtils.isAdmin()) {
            if (!SecurityUtils.isFaculty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only faculty or admin can create laboratories"));
            }
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                Faculty faculty = laboratoryService.getFacultyByUserIdOrEmail(principal.getUserId(), principal.getEmail());
                if (faculty != null && faculty.getDepartmentEntity() != null) {
                    lab.setDepartment(faculty.getDepartmentEntity());
                }
            }
        }
        if (lab.getStatus() == null) {
            lab.setStatus("Active");
        }
        Laboratory saved = laboratoryService.createLab(lab);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Laboratory created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLab(@PathVariable Long id, @RequestBody Laboratory labDetails) {
        if (!SecurityUtils.isAdmin()) {
            if (!SecurityUtils.isFaculty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only faculty or admin can update laboratories"));
            }
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                Faculty faculty = laboratoryService.getFacultyByUserIdOrEmail(principal.getUserId(), principal.getEmail());
                Laboratory existing = laboratoryService.getLabById(id);
                if (existing != null && faculty != null && faculty.getDepartmentEntity() != null) {
                    if (!faculty.getDepartmentEntity().getDepartmentId().equals(existing.getDepartment().getDepartmentId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You can only update laboratories in your own department."));
                    }
                    labDetails.setDepartment(faculty.getDepartmentEntity());
                }
            }
        }

        Laboratory updated = laboratoryService.updateLab(id, labDetails);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found for update"));
        }
        return ResponseEntity.ok(ApiResponse.success("Laboratory updated successfully", updated));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activateLab(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        lab.setStatus("Active");
        Laboratory updated = laboratoryService.updateLab(id, lab);
        return ResponseEntity.ok(ApiResponse.success("Laboratory activated successfully", updated));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateLab(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        lab.setStatus("Inactive");
        Laboratory updated = laboratoryService.updateLab(id, lab);
        return ResponseEntity.ok(ApiResponse.success("Laboratory deactivated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLab(@PathVariable Long id) {
        if (!SecurityUtils.isAdmin()) {
            if (!SecurityUtils.isFaculty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Only faculty or admin can delete laboratories"));
            }
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                Faculty faculty = laboratoryService.getFacultyByUserIdOrEmail(principal.getUserId(), principal.getEmail());
                Laboratory existing = laboratoryService.getLabById(id);
                if (existing != null && faculty != null && faculty.getDepartmentEntity() != null) {
                    if (!faculty.getDepartmentEntity().getDepartmentId().equals(existing.getDepartment().getDepartmentId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You can only delete laboratories in your own department."));
                    }
                }
            }
        }

        laboratoryService.deleteLab(id);
        return ResponseEntity.ok(ApiResponse.success("Laboratory deleted successfully"));
    }

    @GetMapping("/{id}/equipment")
    public ResponseEntity<?> getLabEquipment(@PathVariable Long id) {
        List<Equipment> equipment = equipmentRepository.findByLaboratoryLabId(id);
        return ResponseEntity.ok(ApiResponse.success("Equipment loaded for laboratory ID: " + id, equipment));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<?> getLabBookings(@PathVariable Long id) {
        List<Booking> bookings = bookingRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("equipment").get("laboratory").get("labId"), id)
        );
        return ResponseEntity.ok(ApiResponse.success("Bookings loaded for laboratory ID: " + id, bookings));
    }

    @GetMapping("/{id}/faculty")
    public ResponseEntity<?> getLabFaculty(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        List<Faculty> facultyList = facultyRepository.findAll((root, query, cb) -> 
            cb.like(cb.lower(root.get("lab")), "%" + lab.getName().toLowerCase() + "%")
        );
        return ResponseEntity.ok(ApiResponse.success("Faculty loaded for laboratory: " + lab.getName(), facultyList));
    }

    @PatchMapping("/{id}/faculty")
    public ResponseEntity<?> assignFacultyToLab(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long facultyId = body.get("facultyId");
        if (facultyId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("facultyId is required"));
        }
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setLab(lab.getName());
        facultyRepository.save(faculty);
        return ResponseEntity.ok(ApiResponse.success("Faculty " + faculty.getName() + " assigned to lab: " + lab.getName()));
    }

    @DeleteMapping("/{id}/faculty/{facultyId}")
    public ResponseEntity<?> removeFacultyFromLab(@PathVariable Long id, @PathVariable Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId).orElse(null);
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Faculty not found"));
        }
        faculty.setLab("-");
        facultyRepository.save(faculty);
        return ResponseEntity.ok(ApiResponse.success("Faculty removed from laboratory assignment"));
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<?> getStatistics(@PathVariable Long id) {
        Laboratory lab = laboratoryService.getLabById(id);
        if (lab == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Laboratory not found"));
        }
        long eqCount = equipmentRepository.countByLaboratoryLabId(id);
        long activeBookings = bookingRepository.findAll((root, query, cb) -> 
            cb.and(
                cb.equal(root.get("equipment").get("laboratory").get("labId"), id),
                cb.or(
                    cb.equal(root.get("status"), "Approved"),
                    cb.equal(root.get("status"), "Issued")
                )
            )
        ).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("equipmentCount", eqCount);
        stats.put("activeBookings", activeBookings);
        stats.put("labCapacity", lab.getCapacity());
        return ResponseEntity.ok(ApiResponse.success("Laboratory statistics loaded", stats));
    }
}
