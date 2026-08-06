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

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByStudentId(Long studentId) {
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

            // 2. Try finding by ID if email lookup returned null
            if (student == null && sId != null) {
                student = studentRepository.findById(sId).orElse(null);
            }

            // 3. If student does not exist, auto-create student record in business DB
            if (student == null) {
                Student newStudent = new Student();
                if (sId != null) newStudent.setStudentId(sId);
                newStudent.setName(incomingName != null && !incomingName.trim().isEmpty() ? incomingName.trim() : "Student");
                newStudent.setEmail(studentEmail != null && !studentEmail.trim().isEmpty() ? studentEmail.trim() : "student@smartlab.com");
                newStudent.setDepartment(booking.getStudent().getDepartment() != null ? booking.getStudent().getDepartment() : "Computer Science & Engineering");
                newStudent.setYear(3);
                newStudent.setStatus("Active");
                student = studentRepository.save(newStudent);
            } else {
                // 4. If student exists but incoming name is updated (e.g. Premnath), update student record
                if (incomingName != null && !incomingName.trim().isEmpty() && !incomingName.equalsIgnoreCase(student.getName())) {
                    student.setName(incomingName.trim());
                    student = studentRepository.save(student);
                }
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
            Long studentId = saved.getStudent() != null ? saved.getStudent().getStudentId() : null;

            if (studentId != null) {
                notificationService.createNotification(studentId, "STUDENT", "Booking Submitted", "Your request for " + eqName + " has been submitted for approval.", "Booking");
            }
            // Send live alert to all faculty members
            facultyRepository.findAll().forEach(f -> {
                if (f.getFacultyId() != null) {
                    notificationService.createNotification(f.getFacultyId(), "FACULTY", "New Booking Request", studentName + " requested " + eqName + ".", "Booking");
                }
            });
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
                Long studentId = saved.getStudent() != null ? saved.getStudent().getStudentId() : null;
                if (studentId != null) {
                    notificationService.createNotification(studentId, "STUDENT", "Booking Approved", "Your booking request for " + eqName + " has been approved.", "Booking");
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
                Long studentId = saved.getStudent() != null ? saved.getStudent().getStudentId() : null;
                if (studentId != null) {
                    notificationService.createNotification(studentId, "STUDENT", "Booking Rejected", "Your booking request for " + eqName + " was rejected.", "Booking");
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
