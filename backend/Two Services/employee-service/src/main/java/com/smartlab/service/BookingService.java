package com.smartlab.service;

import com.smartlab.entity.Booking;
import com.smartlab.entity.Equipment;
import com.smartlab.entity.Student;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import com.smartlab.repository.FacultyRepository;

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
        return bookingRepository.findAll();
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
        if (booking.getStudent() != null && booking.getStudent().getStudentId() != null) {
            Student student = studentRepository.findById(booking.getStudent().getStudentId())
                    .orElse(null);
            if (student != null) {
                booking.setStudent(student);
            }
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
            // Send to all faculty members
            facultyRepository.findAll().forEach(f -> {
                if (f.getFacultyId() != null) {
                    notificationService.createNotification(f.getFacultyId(), "FACULTY", "New Booking Request", studentName + " requested " + eqName + ".", "Booking");
                }
            });
        } catch (Exception e) {
            // ignore notification failures
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
