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

        // Seed Default Sample Student Candidates
        seedStudent("Aarav Mehta", "aarav.mehta@university.edu", "RA2111003010491", LocalDate.of(2003, 5, 14));
        seedStudent("Ananya Sharma", "ananya.sharma@university.edu", "RA2111003010492", LocalDate.of(2002, 11, 20));
        seedStudent("Rohan Kapoor", "rohan.kapoor@university.edu", "RA2111003010493", LocalDate.of(2003, 1, 10));
        seedStudent("Priya Patel", "priya.patel@university.edu", "RA2111003010494", LocalDate.of(2003, 8, 25));
        seedStudent("Vikram Singh", "vikram.singh@university.edu", "RA2111003010495", LocalDate.of(2002, 4, 3));

        // Seed User Requested KCE & Gmail Student Registration Candidates
        seedStudent("Student 226", "717824f226@kce.ac.in", "717824F226", LocalDate.of(2004, 1, 15));
        seedStudent("Student 220", "717824f220@kce.ac.in", "717824F220", LocalDate.of(2004, 2, 20));
        seedStudent("Student 242", "717824f242@kce.ac.in", "717824F242", LocalDate.of(2004, 3, 25));
        seedStudent("Karthikeyan RKS", "karthikeyanrks2007@gmail.com", "717824F207", LocalDate.of(2007, 5, 10));
        seedStudent("Student 250", "717824f250@kce.ac.in", "717824F250", LocalDate.of(2004, 5, 12));
        seedStudent("Student 256", "717824f256@kce.ac.in", "717824F256", LocalDate.of(2004, 6, 18));
        seedStudent("Student 251", "717824f251@kce.ac.in", "717824F251", LocalDate.of(2004, 7, 22));

        // Seed Faculty Candidates
        seedFaculty("Dr. S. Ramanujan", "s.ramanujan@university.edu", "FAC-CSE-001", LocalDate.of(1985, 12, 22));
        seedFaculty("Dr. Sunita Williams", "sunita.williams@university.edu", "FAC-EEE-002", LocalDate.of(1988, 6, 15));
        seedFaculty("Dr. Vikram Sarabhai", "vikram.sarabhai@university.edu", "FAC-MECH-003", LocalDate.of(1980, 8, 12));
    }

    private void seedStudent(String name, String email, String regNo, LocalDate dob) {
        if (!userRepository.existsByEmail(email)) {
            AppUser u = new AppUser();
            u.setName(name);
            u.setEmail(email);
            u.setRegNo(regNo);
            u.setDob(dob);
            u.setRole(Role.STUDENT);
            u.setStatus("UNACTIVATED");
            userRepository.save(u);
            log.info("Seeded registration candidate: {} ({})", email, regNo);
        }
    }

    private void seedFaculty(String name, String email, String facultyId, LocalDate dob) {
        if (!userRepository.existsByEmail(email)) {
            AppUser u = new AppUser();
            u.setName(name);
            u.setEmail(email);
            u.setFacultyId(facultyId);
            u.setDob(dob);
            u.setRole(Role.FACULTY);
            u.setStatus("UNACTIVATED");
            userRepository.save(u);
            log.info("Seeded faculty candidate: {} ({})", email, facultyId);
        }
    }
}
