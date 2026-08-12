package com.smartlab.service;

import com.smartlab.entity.Booking;
import com.smartlab.entity.Equipment;
import com.smartlab.entity.Student;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.StudentRepository;
import com.smartlab.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final StudentRepository studentRepository;
    private final EquipmentRepository equipmentRepository;
    private final FacultyRepository facultyRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          StudentRepository studentRepository,
                          EquipmentRepository equipmentRepository,
                          FacultyRepository facultyRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.studentRepository = studentRepository;
        this.equipmentRepository = equipmentRepository;
        this.facultyRepository = facultyRepository;
        this.notificationService = notificationService;
    }

    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        // Dynamic name safety check for existing bookings
        for (Booking b : bookings) {
            if (b.getStudent() != null && b.getStudent().getEmail() != null) {
                String email = b.getStudent().getEmail().trim().toLowerCase();
                String currentName = b.getStudent().getName();
                
                // If student name in DB is still hardcoded legacy "Karthikeyan S", fix it from email
                if (currentName != null && currentName.equalsIgnoreCase("Karthikeyan S") && !email.contains("karthikeyan") && !email.contains("student@smartlab")) {
                    String prefix = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
                    String newName = Character.toUpperCase(prefix.charAt(0)) + prefix.substring(1);
                    b.getStudent().setName(newName);
                    studentRepository.save(b.getStudent());
                }
            }
        }
        return bookings;
    }

    public List<Booking> getBookingsByDepartment(Long departmentId) {
        List<Booking> bookings = bookingRepository.findByEquipmentLaboratoryDepartmentDepartmentId(departmentId);
        for (Booking b : bookings) {
            if (b.getStudent() != null && b.getStudent().getEmail() != null) {
                String email = b.getStudent().getEmail().trim().toLowerCase();
                String currentName = b.getStudent().getName();
                if (currentName != null && currentName.equalsIgnoreCase("Karthikeyan S") && !email.contains("karthikeyan") && !email.contains("student@smartlab")) {
                    String prefix = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
                    String newName = Character.toUpperCase(prefix.charAt(0)) + prefix.substring(1);
                    b.getStudent().setName(newName);
                    studentRepository.save(b.getStudent());
                }
            }
        }
        return bookings;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByStudentId(Long studentId) {
        Student student = studentRepository.findAll().stream()
                .filter(s -> studentId.equals(s.getUserId()) || studentId.equals(s.getStudentId()))
                .findFirst()
                .orElse(null);
        if (student != null) {
            return bookingRepository.findByStudentStudentId(student.getStudentId());
        }
        return bookingRepository.findByStudentStudentId(studentId);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStudent() != null) {
            String studentEmail = booking.getStudent().getEmail();
            String incomingName = booking.getStudent().getName();
            Long sId = booking.getStudent().getStudentId();

            Student student = null;

            // 1. Try finding student by email first (exact identity match)
            if (studentEmail != null && !studentEmail.trim().isEmpty()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim());
            }

            // 2. Try finding by ID / userId
            if (student == null && sId != null) {
                student = studentRepository.findAll().stream()
                        .filter(s -> sId.equals(s.getUserId()) || sId.equals(s.getStudentId()))
                        .findFirst()
                        .orElse(null);
            }

            // 3. If student does not exist, auto-create student record in business DB
            if (student == null) {
                Student newStudent = new Student();
                newStudent.setUserId(sId);
                newStudent.setName(incomingName != null && !incomingName.trim().isEmpty() ? incomingName.trim() : "Student");
                newStudent.setEmail(studentEmail != null && !studentEmail.trim().isEmpty() ? studentEmail.trim() : "student@smartlab.com");
                newStudent.setDepartment(booking.getStudent().getDepartment() != null ? booking.getStudent().getDepartment() : "Computer Science & Engineering");
                newStudent.setYear(3);
                newStudent.setStatus("Active");
                student = studentRepository.save(newStudent);
            } else {
                if (student.getUserId() == null && sId != null) {
                    student.setUserId(sId);
                }
                if (incomingName != null && !incomingName.trim().isEmpty() && !incomingName.equalsIgnoreCase(student.getName())) {
                    student.setName(incomingName.trim());
                }
                student = studentRepository.save(student);
            }
            booking.setStudent(student);
        }

        if (booking.getEquipment() != null && booking.getEquipment().getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(booking.getEquipment().getEquipmentId())
                    .orElse(null);
            if (equipment != null) {
                booking.setEquipment(equipment);
            }
        }

        // Validate department compatibility
        if (booking.getStudent() != null && booking.getEquipment() != null) {
            Student student = booking.getStudent();
            Equipment equipment = booking.getEquipment();
            
            if (student.getDepartmentEntity() != null &&
                equipment.getLaboratory() != null &&
                equipment.getLaboratory().getDepartment() != null) {
                
                Long studentDeptId = student.getDepartmentEntity().getDepartmentId();
                Long equipDeptId = equipment.getLaboratory().getDepartment().getDepartmentId();
                
                if (!studentDeptId.equals(equipDeptId)) {
                    throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.FORBIDDEN, 
                        "Department authorization violation: Student's department does not match the equipment's department."
                    );
                }
            }
        }

        if (booking.getStatus() == null) {
            booking.setStatus("Pending");
        }
        if (booking.getBookedAt() == null) {
            booking.setBookedAt(new Date());
        }

        Booking saved = bookingRepository.save(booking);

        try {
            String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
            String studentName = saved.getStudent() != null ? saved.getStudent().getName() : "Student";
            Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;

            if (notifUserId != null) {
                notificationService.createNotification(notifUserId, "STUDENT", "Booking Submitted", "Your request for " + eqName + " has been submitted for approval.", "Booking");
            }
            
            // Send live alert ONLY to faculty members of the SAME department
            if (saved.getStudent() != null && saved.getStudent().getDepartmentEntity() != null) {
                Long studentDeptId = saved.getStudent().getDepartmentEntity().getDepartmentId();
                facultyRepository.findAll().stream()
                    .filter(f -> f.getDepartmentEntity() != null && studentDeptId.equals(f.getDepartmentEntity().getDepartmentId()))
                    .forEach(f -> {
                        Long fUserId = f.getUserId() != null ? f.getUserId() : f.getFacultyId();
                        if (fUserId != null) {
                            notificationService.createNotification(fUserId, "FACULTY", "New Booking Request", studentName + " requested " + eqName + ".", "Booking");
                        }
                    });
            }
        } catch (Exception e) {
            // ignore notification log errors
        }

        return saved;
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Approved");
            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Booking Approved", "Your booking request for " + eqName + " has been approved.", "Booking");
                }
            } catch (Exception e) {}
            return saved;
        }
        return null;
    }

    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Rejected");
            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Booking Rejected", "Your booking request for " + eqName + " was rejected.", "Booking");
                }
            } catch (Exception e) {}
            return saved;
        }
        return null;
    }

    public Booking issueBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Issued");
            if (booking.getEquipment() != null) {
                Equipment eq = booking.getEquipment();
                eq.setStatus("In Use");
                equipmentRepository.save(eq);
            }
            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Equipment Issued", "The equipment " + eqName + " has been issued to you by the lab assistant.", "Booking");
                }
            } catch (Exception e) {}
            return saved;
        }
        return null;
    }

    public Booking completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Completed");
            if (booking.getEquipment() != null) {
                Equipment eq = booking.getEquipment();
                eq.setStatus("Available");
                equipmentRepository.save(eq);
            }
            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Equipment Collected", "The equipment " + eqName + " has been returned successfully.", "Booking");
                }
            } catch (Exception e) {}
            return saved;
        }
        return null;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
