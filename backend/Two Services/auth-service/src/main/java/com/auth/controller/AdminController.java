package com.auth.controller;

import com.auth.dto.AdminRegisterRequest;
import com.auth.dto.AdminStudentCreateRequest;
import com.auth.dto.AdminFacultyCreateRequest;
import com.auth.entity.AppUser;
import com.auth.entity.Role;
import com.auth.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/admin")
public class AdminController {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
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
        if (appUserRepository.findByEmail(req.getEmail().toLowerCase().trim()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        AppUser user = new AppUser();
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setName(req.getName());
        user.setRegNo(req.getRegNo());
        user.setDob(req.getDob());
        user.setRole(Role.STUDENT);
        user.setStatus("UNACTIVATED");
        appUserRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Pre-create faculty candidate
    @PostMapping("/faculty")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFacultyCandidate(@RequestBody AdminFacultyCreateRequest req) {
        if (appUserRepository.findByEmail(req.getEmail().toLowerCase().trim()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        AppUser user = new AppUser();
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setName(req.getName());
        user.setFacultyId(req.getFacultyId());
        user.setDob(req.getDob());
        user.setRole(Role.FACULTY);
        user.setStatus("UNACTIVATED");
        appUserRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Update user
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody AppUser userDetails) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AppUser user = optional.get();
        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail().toLowerCase().trim());
        if (userDetails.getRegNo() != null) user.setRegNo(userDetails.getRegNo());
        if (userDetails.getFacultyId() != null) user.setFacultyId(userDetails.getFacultyId());
        if (userDetails.getStatus() != null) user.setStatus(userDetails.getStatus());
        appUserRepository.save(user);
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

        appUserRepository.save(user);
        return ResponseEntity.ok("Admin account created successfully");
    }
}
