package com.auth.config;

import com.auth.entity.AppUser;
import com.auth.entity.Role;
import com.auth.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking Auth Service seed users...");

        // Admin User
        if (!userRepository.existsByEmail("admin@smartlab.com")) {
            AppUser admin = new AppUser();
            admin.setName("System Admin");
            admin.setEmail("admin@smartlab.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setStatus("ACTIVE");
            admin.setRegNo("ADM-001");
            admin.setDob(LocalDate.of(1990, 1, 1));
            userRepository.save(admin);
            log.info("Created seed user: admin@smartlab.com / admin123");
        }

        // Faculty User (Default Active)
        if (!userRepository.existsByEmail("faculty@smartlab.com")) {
            AppUser faculty = new AppUser();
            faculty.setName("Dr. Anitha Raman");
            faculty.setEmail("faculty@smartlab.com");
            faculty.setPassword(passwordEncoder.encode("faculty123"));
            faculty.setRole(Role.FACULTY);
            faculty.setStatus("ACTIVE");
            faculty.setFacultyId("FAC-101");
            faculty.setDob(LocalDate.of(1985, 5, 15));
            userRepository.save(faculty);
            log.info("Created seed user: faculty@smartlab.com / faculty123");
        }

        // Student User (Default Active)
        if (!userRepository.existsByEmail("student@smartlab.com")) {
            AppUser student = new AppUser();
            student.setName("Karthikeyan S");
            student.setEmail("student@smartlab.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(Role.STUDENT);
            student.setStatus("ACTIVE");
            student.setRegNo("21CS101");
            student.setDob(LocalDate.of(2002, 8, 20));
            userRepository.save(student);
            log.info("Created seed user: student@smartlab.com / student123");
        }

        // --- SEED EXPANDED EEE DEPARTMENT ---
        seedActiveFaculty("Dr. Sunita Williams", "faculty.eee@smartlab.com", "FAC-EEE-110", LocalDate.of(1980, 5, 12));
        seedActiveFaculty("EEE Assistant Ram", "assistant.eee@smartlab.com", "AST-EEE-111", LocalDate.of(1992, 1, 20));
        seedActiveStudent("Aditya EEE 1", "student.eee1@smartlab.com", "7178EEE001", LocalDate.of(2004, 3, 10));
        seedActiveStudent("Bhavana EEE 2", "student.eee2@smartlab.com", "7178EEE002", LocalDate.of(2003, 11, 15));
        seedActiveStudent("Chaitanya EEE 3", "student.eee3@smartlab.com", "7178EEE003", LocalDate.of(2004, 4, 18));
        seedActiveStudent("Divya EEE 4", "student.eee4@smartlab.com", "7178EEE004", LocalDate.of(2003, 8, 25));
        seedActiveStudent("Eshwar EEE 5", "student.eee5@smartlab.com", "7178EEE005", LocalDate.of(2004, 1, 12));

        // --- SEED EXPANDED MECH DEPARTMENT ---
        seedActiveFaculty("Dr. Vikram Sarabhai", "faculty.mech@smartlab.com", "FAC-MECH-120", LocalDate.of(1978, 8, 25));
        seedActiveFaculty("MECH Assistant Krish", "assistant.mech@smartlab.com", "AST-MECH-121", LocalDate.of(1993, 2, 22));
        seedActiveStudent("Madan MECH 1", "student.mech1@smartlab.com", "7178MECH001", LocalDate.of(2004, 5, 5));
        seedActiveStudent("Nitin MECH 2", "student.mech2@smartlab.com", "7178MECH002", LocalDate.of(2003, 9, 12));
        seedActiveStudent("Omkar MECH 3", "student.mech3@smartlab.com", "7178MECH003", LocalDate.of(2004, 6, 20));
        seedActiveStudent("Pranav MECH 4", "student.mech4@smartlab.com", "7178MECH004", LocalDate.of(2003, 12, 14));
        seedActiveStudent("Rahul MECH 5", "student.mech5@smartlab.com", "7178MECH005", LocalDate.of(2004, 2, 28));

        // --- SEED EXPANDED CSE / ECE DEPARTMENT ---
        seedActiveFaculty("Dr. S. Ramanujan", "faculty.cse@smartlab.com", "FAC-CSE-130", LocalDate.of(1982, 12, 22));
        seedActiveFaculty("CSE Assistant Shyam", "assistant.cse@smartlab.com", "AST-CSE-131", LocalDate.of(1991, 7, 14));
        seedActiveStudent("Siddharth CSE 1", "student.cse1@smartlab.com", "7178CSE001", LocalDate.of(2004, 7, 8));
        seedActiveStudent("Tarun CSE 2", "student.cse2@smartlab.com", "7178CSE002", LocalDate.of(2003, 10, 19));
        seedActiveStudent("Uday CSE 3", "student.cse3@smartlab.com", "7178CSE003", LocalDate.of(2004, 1, 30));
        seedActiveStudent("Varun CSE 4", "student.cse4@smartlab.com", "7178CSE004", LocalDate.of(2003, 5, 24));
        seedActiveStudent("Yash CSE 5", "student.cse5@smartlab.com", "7178CSE005", LocalDate.of(2004, 9, 11));
    }

    private void seedActiveStudent(String name, String email, String regNo, LocalDate dob) {
        if (!userRepository.existsByEmail(email)) {
            AppUser u = new AppUser();
            u.setName(name);
            u.setEmail(email);
            u.setRegNo(regNo);
            u.setDob(dob);
            u.setRole(Role.STUDENT);
            u.setPassword(passwordEncoder.encode("student123"));
            u.setStatus("ACTIVE"); // Seeded as ACTIVE so they don't require manual activation
            userRepository.save(u);
            log.info("Seeded active student: {}", email);
        }
    }

    private void seedActiveFaculty(String name, String email, String facultyId, LocalDate dob) {
        if (!userRepository.existsByEmail(email)) {
            AppUser u = new AppUser();
            u.setName(name);
            u.setEmail(email);
            u.setFacultyId(facultyId);
            u.setDob(dob);
            u.setRole(Role.FACULTY);
            u.setPassword(passwordEncoder.encode("password123"));
            u.setStatus("ACTIVE"); // Seeded as ACTIVE so they don't require manual activation
            userRepository.save(u);
            log.info("Seeded active faculty/assistant: {}", email);
        }
    }
}
