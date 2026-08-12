package com.auth.controller;

import com.auth.dto.AdminRegisterRequest;
import com.auth.dto.AdminStudentCreateRequest;
import com.auth.dto.AdminFacultyCreateRequest;
import com.auth.entity.AppUser;
import com.auth.entity.Student;
import com.auth.entity.Faculty;
import com.auth.entity.Admin;
import com.auth.entity.Role;
import com.auth.repository.AppUserRepository;
import com.auth.repository.StudentRepository;
import com.auth.repository.FacultyRepository;
import com.auth.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin")
public class AdminController {

    private final AppUserRepository appUserRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.auth.service.UserSyncService userSyncService;

    public AdminController(AppUserRepository appUserRepository,
                           StudentRepository studentRepository,
                           FacultyRepository facultyRepository,
                           AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder,
                           com.auth.service.UserSyncService userSyncService) {
        this.appUserRepository = appUserRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.userSyncService = userSyncService;
    }

    // List all users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return ResponseEntity.ok(appUserRepository.findAll());
    }

    // Pre-create student candidate
    @PostMapping("/student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudentCandidate(@RequestBody AdminStudentCreateRequest req) {
        Optional<AppUser> existing = appUserRepository.findByEmail(req.getEmail().toLowerCase().trim());
        if (existing.isPresent()) {
            // Idempotent: return existing user if already registered
            return ResponseEntity.ok(existing.get());
        }
        AppUser user = new AppUser();
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setName(req.getName());
        user.setRegNo(req.getRegNo());
        user.setDob(req.getDob());
        user.setRole(Role.STUDENT);
        user.setStatus("UNACTIVATED");
        AppUser savedUser = appUserRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setRegNo(req.getRegNo());
        student.setDob(req.getDob());
        studentRepository.save(student);

        // Sync with smartlab-service
        userSyncService.syncUser(savedUser);

        return ResponseEntity.ok(savedUser);
    }

    // Pre-create faculty candidate
    @PostMapping("/faculty")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFacultyCandidate(@RequestBody AdminFacultyCreateRequest req) {
        Optional<AppUser> existing = appUserRepository.findByEmail(req.getEmail().toLowerCase().trim());
        if (existing.isPresent()) {
            // Idempotent: return existing user if already registered
            return ResponseEntity.ok(existing.get());
        }
        AppUser user = new AppUser();
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setName(req.getName());
        user.setFacultyId(req.getFacultyId());
        user.setDob(req.getDob());
        user.setRole(Role.FACULTY);
        user.setStatus("UNACTIVATED");
        AppUser savedUser = appUserRepository.save(user);

        Faculty faculty = new Faculty();
        faculty.setUser(savedUser);
        faculty.setFacultyCode(req.getFacultyId());
        faculty.setDob(req.getDob());
        facultyRepository.save(faculty);

        // Sync with smartlab-service
        userSyncService.syncUser(savedUser);

        return ResponseEntity.ok(savedUser);
    }

    // Update user
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AppUser user = optional.get();
        if (payload.containsKey("name")) user.setName((String) payload.get("name"));
        if (payload.containsKey("email")) user.setEmail(((String) payload.get("email")).toLowerCase().trim());
        if (payload.containsKey("status")) user.setStatus((String) payload.get("status"));
        
        if (user.getRole() == Role.STUDENT) {
            if (payload.containsKey("regNo")) user.setRegNo((String) payload.get("regNo"));
            if (payload.containsKey("dob") && payload.get("dob") != null) {
                user.setDob(java.time.LocalDate.parse((String) payload.get("dob")));
            }
            appUserRepository.save(user);

            // Sync with profile table
            Student student = studentRepository.findByUser(user).orElse(null);
            if (student == null) {
                student = new Student();
                student.setUser(user);
            }
            student.setRegNo(user.getRegNo());
            student.setDob(user.getDob());
            studentRepository.save(student);

        } else if (user.getRole() == Role.FACULTY) {
            if (payload.containsKey("facultyId")) user.setFacultyId((String) payload.get("facultyId"));
            if (payload.containsKey("dob") && payload.get("dob") != null) {
                user.setDob(java.time.LocalDate.parse((String) payload.get("dob")));
            }
            appUserRepository.save(user);

            // Sync with profile table
            Faculty faculty = facultyRepository.findByUser(user).orElse(null);
            if (faculty == null) {
                faculty = new Faculty();
                faculty.setUser(user);
            }
            faculty.setFacultyCode(user.getFacultyId());
            faculty.setDob(user.getDob());
            facultyRepository.save(faculty);
        } else {
            appUserRepository.save(user);
        }

        // Sync with smartlab-service
        userSyncService.syncUser(user);
        
        return ResponseEntity.ok(user);
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!appUserRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appUserRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Create admin
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody AdminRegisterRequest req) {
        if (appUserRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        AppUser user = new AppUser();
        user.setEmail(req.getEmail());
        user.setName(req.getName() != null ? req.getName() : "Admin");
        user.setDob(req.getDob());
        user.setRole(Role.ADMIN);
        user.setStatus("ACTIVE");
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        AppUser savedUser = appUserRepository.save(user);

        Admin admin = new Admin();
        admin.setUser(savedUser);
        adminRepository.save(admin);

        return ResponseEntity.ok("Admin account created successfully");
    }
}
