package com.auth.repository;

import com.auth.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    // Common lookup by email
    Optional<AppUser> findByEmail(String email);

    // Student identity check
    @Query("SELECT u FROM AppUser u WHERE u.regNo = :regNo AND u.email = :email AND u.dob = :dob")
    Optional<AppUser> findByRegNoAndEmailAndDob(String regNo, String email, LocalDate dob);

    // Faculty identity check
    @Query("SELECT u FROM AppUser u WHERE u.facultyId = :facultyId AND u.email = :email AND u.dob = :dob")
    Optional<AppUser> findByFacultyIdAndEmailAndDob(String facultyId, String email, LocalDate dob);

    // Check if email already exists
    boolean existsByEmail(String email);
    
    
}
