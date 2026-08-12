package com.smartlab.controller;

import com.smartlab.entity.Booking;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.service.BookingService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/business/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final StudentService studentService;
    private final FacultyService facultyService;

    public BookingController(BookingService bookingService, StudentService studentService, FacultyService facultyService) {
        this.bookingService = bookingService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        if (SecurityUtils.isAdmin()) {
            return bookingService.getAllBookings();
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
                return bookingService.getBookingsByDepartment(faculty.getDepartmentEntity().getDepartmentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department profile not found");
        }

        if (SecurityUtils.isStudent()) {
            Student student = studentService.getStudentByUserId(principal.getUserId());
            if (student == null) {
                student = studentService.getStudentByEmail(principal.getEmail());
            }
            if (student != null) {
                return bookingService.getBookingsByStudentId(student.getStudentId());
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student profile not found");
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        // Enforce authorization
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
                if (student == null || booking.getStudent() == null || 
                    (!student.getStudentId().equals(booking.getStudent().getStudentId()) && 
                     !student.getUserId().equals(booking.getStudent().getUserId()))) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this booking.");
                }
            } else if (SecurityUtils.isFaculty()) {
                checkBookingDepartmentAccess(booking);
            } else {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/student/{studentId}")
    public List<Booking> getBookingsByStudentId(@PathVariable Long studentId) {
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
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view another student's booking history.");
                }
            } else if (SecurityUtils.isFaculty()) {
                Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                if (faculty == null) {
                    faculty = facultyService.getFacultyByEmail(principal.getEmail());
                }
                if (faculty == null || faculty.getDepartmentEntity() == null) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Faculty department not found");
                }
                // Check if the requested student is in the same department
                Student requestedStudent = studentService.getStudentById(studentId);
                if (requestedStudent == null) {
                    // Try by userId
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
        return bookingService.getBookingsByStudentId(studentId);
    }

    @GetMapping("/status/{status}")
    public List<Booking> getBookingsByStatus(@PathVariable String status) {
        if (!SecurityUtils.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can query bookings by status globally.");
        }
        return bookingService.getBookingsByStatus(status);
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
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
        booking.setStudent(student);
        return bookingService.createBooking(booking);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        checkBookingDepartmentAccess(booking);
        
        Booking updated = bookingService.approveBooking(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        checkBookingDepartmentAccess(booking);

        Booking updated = bookingService.rejectBooking(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/issue")
    public ResponseEntity<Booking> issueBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        checkBookingDepartmentAccess(booking);

        Booking updated = bookingService.issueBooking(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        checkBookingDepartmentAccess(booking);

        Booking updated = bookingService.completeBooking(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking != null) {
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
                    if (student == null || booking.getStudent() == null ||
                        (!student.getStudentId().equals(booking.getStudent().getStudentId()) &&
                         !student.getUserId().equals(booking.getStudent().getUserId()))) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete another user's booking.");
                    }
                } else if (SecurityUtils.isFaculty()) {
                    checkBookingDepartmentAccess(booking);
                }
            }
            bookingService.deleteBooking(id);
        }
        return ResponseEntity.noContent().build();
    }

    private void checkBookingDepartmentAccess(Booking booking) {
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

        boolean studentDeptMatches = booking.getStudent() != null &&
                                     booking.getStudent().getDepartmentEntity() != null &&
                                     facDeptId.equals(booking.getStudent().getDepartmentEntity().getDepartmentId());

        boolean equipDeptMatches = booking.getEquipment() != null &&
                                   booking.getEquipment().getLaboratory() != null &&
                                   booking.getEquipment().getLaboratory().getDepartment() != null &&
                                   facDeptId.equals(booking.getEquipment().getLaboratory().getDepartment().getDepartmentId());

        if (!studentDeptMatches && !equipDeptMatches) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Department authorization violation: Booking does not belong to your department.");
        }
    }
}
