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
        seedActiveFaculty("Dr. Sunita Williams", "faculty.eee@kce.ac.in", "FAC-EEE-110", LocalDate.of(1980, 5, 12));
        seedActiveFaculty("EEE Assistant Ram", "assistant.eee@kce.ac.in", "AST-EEE-111", LocalDate.of(1992, 1, 20));
        seedActiveStudent("Aditya EEE 1", "student.eee1@kce.ac.in", "7178EEE001", LocalDate.of(2004, 3, 10));
        seedActiveStudent("Bhavana EEE 2", "student.eee2@kce.ac.in", "7178EEE002", LocalDate.of(2003, 11, 15));
        seedActiveStudent("Chaitanya EEE 3", "student.eee3@kce.ac.in", "7178EEE003", LocalDate.of(2004, 4, 18));
        seedActiveStudent("Divya EEE 4", "student.eee4@kce.ac.in", "7178EEE004", LocalDate.of(2003, 8, 25));
        seedActiveStudent("Eshwar EEE 5", "student.eee5@kce.ac.in", "7178EEE005", LocalDate.of(2004, 1, 12));

        // --- SEED EXPANDED MECH DEPARTMENT ---
        seedActiveFaculty("Dr. Vikram Sarabhai", "faculty.mech@kce.ac.in", "FAC-MECH-120", LocalDate.of(1978, 8, 25));
        seedActiveFaculty("MECH Assistant Krish", "assistant.mech@kce.ac.in", "AST-MECH-121", LocalDate.of(1993, 2, 22));
        seedActiveStudent("Madan MECH 1", "student.mech1@kce.ac.in", "7178MECH001", LocalDate.of(2004, 5, 5));
        seedActiveStudent("Nitin MECH 2", "student.mech2@kce.ac.in", "7178MECH002", LocalDate.of(2003, 9, 12));
        seedActiveStudent("Omkar MECH 3", "student.mech3@kce.ac.in", "7178MECH003", LocalDate.of(2004, 6, 20));
        seedActiveStudent("Pranav MECH 4", "student.mech4@kce.ac.in", "7178MECH004", LocalDate.of(2003, 12, 14));
        seedActiveStudent("Rahul MECH 5", "student.mech5@kce.ac.in", "7178MECH005", LocalDate.of(2004, 2, 28));

        // --- SEED EXPANDED CSE / ECE DEPARTMENT (WITH OFFICIAL KCE STUDENT EMAILS) ---
        seedActiveFaculty("Dr. S. Ramanujan", "faculty.cse@kce.ac.in", "FAC-CSE-130", LocalDate.of(1982, 12, 22));
        seedActiveFaculty("CSE Assistant Shyam", "assistant.cse@kce.ac.in", "AST-CSE-131", LocalDate.of(1991, 7, 14));
        
        seedActiveStudent("Student 226", "717824f226@kce.ac.in", "717824F226", LocalDate.of(2004, 1, 15));
        seedActiveStudent("Student 220", "717824f220@kce.ac.in", "717824F220", LocalDate.of(2004, 2, 20));
        seedActiveStudent("Student 242", "717824f242@kce.ac.in", "717824F242", LocalDate.of(2004, 3, 25));
        seedActiveStudent("Karthikeyan RKS", "karthikeyanrks2007@gmail.com", "717824F207", LocalDate.of(2007, 5, 10));
        seedActiveStudent("Student 250", "717824f250@kce.ac.in", "717824F250", LocalDate.of(2004, 5, 12));
        seedActiveStudent("Student 256", "717824f256@kce.ac.in", "717824F256", LocalDate.of(2004, 6, 18));
        seedActiveStudent("Student 251", "717824f251@kce.ac.in", "717824F251", LocalDate.of(2004, 7, 22));
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
            u.setStatus("ACTIVE");
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
            u.setStatus("ACTIVE");
            userRepository.save(u);
            log.info("Seeded active faculty/assistant: {}", email);
        }
    }
}
