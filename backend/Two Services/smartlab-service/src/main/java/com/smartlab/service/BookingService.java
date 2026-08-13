package com.smartlab.service;

import com.smartlab.entity.Booking;
import com.smartlab.entity.Equipment;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.repository.StudentRepository;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
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
    private final EmailService emailService;
    private final TelegramService telegramService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BookingService.class);

    public BookingService(BookingRepository bookingRepository,
                          StudentRepository studentRepository,
                          EquipmentRepository equipmentRepository,
                          FacultyRepository facultyRepository,
                          NotificationService notificationService,
                          EmailService emailService,
                          TelegramService telegramService) {
        this.bookingRepository = bookingRepository;
        this.studentRepository = studentRepository;
        this.equipmentRepository = equipmentRepository;
        this.facultyRepository = facultyRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.telegramService = telegramService;
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
                        // Send Email
                        if (f.getEmail() != null && !f.getEmail().trim().isEmpty()) {
                            try {
                                String details = "<tr><td class='label'>Student:</td><td class='value'>" + studentName + "</td></tr>" +
                                                 "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                                 "<tr><td class='label'>Date:</td><td class='value'>" + saved.getDate() + "</td></tr>" +
                                                 "<tr><td class='label'>Time Slot:</td><td class='value'>" + saved.getTimeSlot() + "</td></tr>";
                                String html = emailService.buildTemplate("New Booking Request", "New Booking Request", "A student has submitted a new equipment booking request for your approval.", details);
                                emailService.sendEmail(f.getEmail(), "SmartLab AI - New Booking Request: " + eqName, html);
                            } catch (Exception e) {
                                log.warn("Failed to send booking email to faculty: {}", e.getMessage());
                            }
                        }
                        // Send Telegram Alert
                        try {
                            telegramService.sendTelegramMessage("<b>SmartLab AI - New Booking Request</b>\nStudent: " + studentName + "\nEquipment: " + eqName + "\nDate: " + saved.getDate() + "\nTime Slot: " + saved.getTimeSlot());
                        } catch (Exception e) {
                            log.warn("Failed to send booking Telegram alert to faculty: {}", e.getMessage());
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
            
            // Resolve current faculty member
            Faculty approver = null;
            try {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal != null) {
                    approver = facultyRepository.findByUserId(principal.getUserId());
                    if (approver == null) {
                        approver = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
                    }
                }
            } catch (Exception e) {}
            if (approver != null) {
                booking.setApprovedBy(approver);
            }

            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                String approverName = (saved.getApprovedBy() != null) ? saved.getApprovedBy().getName() : "Faculty";
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Booking Approved", "Your booking request for " + eqName + " has been approved by " + approverName + ".", "Booking");
                }
                
                // Email student
                if (saved.getStudent() != null && saved.getStudent().getEmail() != null && !saved.getStudent().getEmail().trim().isEmpty()) {
                    String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                     "<tr><td class='label'>Date:</td><td class='value'>" + saved.getDate() + "</td></tr>" +
                                     "<tr><td class='label'>Time Slot:</td><td class='value'>" + saved.getTimeSlot() + "</td></tr>" +
                                     "<tr><td class='label'>Status:</td><td class='value' style='color: green; font-weight: bold;'>Approved</td></tr>";
                    String html = emailService.buildTemplate("Booking Approved", "Your booking request is approved!", "Good news! Your equipment booking request has been approved by " + approverName + ".", details);
                    emailService.sendEmail(saved.getStudent().getEmail(), "SmartLab AI - Booking Approved: " + eqName, html);
                }

                // Telegram alert
                try {
                    telegramService.sendTelegramMessage("<b>SmartLab AI - Booking Approved</b>\nEquipment: " + eqName + "\nApproved by: " + approverName);
                } catch (Exception e) {
                    log.warn("Failed to send approval Telegram alert: {}", e.getMessage());
                }
            } catch (Exception e) {
                log.warn("Failed to notify student of approval: {}", e.getMessage());
            }
            return saved;
        }
        return null;
    }

    public Booking rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Rejected");
            booking.setRejectionReason(reason);

            // Resolve current faculty member
            Faculty rejecter = null;
            try {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal != null) {
                    rejecter = facultyRepository.findByUserId(principal.getUserId());
                    if (rejecter == null) {
                        rejecter = facultyRepository.findByEmailIgnoreCase(principal.getEmail());
                    }
                }
            } catch (Exception e) {}
            if (rejecter != null) {
                booking.setApprovedBy(rejecter);
            }

            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                String displayReason = reason != null && !reason.trim().isEmpty() ? reason : "No reason specified";
                String rejecterName = (saved.getApprovedBy() != null) ? saved.getApprovedBy().getName() : "Faculty";
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Booking Rejected", "Your booking request for " + eqName + " was rejected by " + rejecterName + ". Reason: " + displayReason, "Booking");
                }
                
                // Email student
                if (saved.getStudent() != null && saved.getStudent().getEmail() != null && !saved.getStudent().getEmail().trim().isEmpty()) {
                    String details = "<tr><td class='label'>Equipment:</td><td class='value'>" + eqName + "</td></tr>" +
                                     "<tr><td class='label'>Date:</td><td class='value'>" + saved.getDate() + "</td></tr>" +
                                     "<tr><td class='label'>Time Slot:</td><td class='value'>" + saved.getTimeSlot() + "</td></tr>" +
                                     "<tr><td class='label'>Status:</td><td class='value' style='color: red; font-weight: bold;'>Rejected</td></tr>" +
                                     "<tr><td class='label'>Rejection Reason:</td><td class='value' style='font-style: italic; color: #718096;'>" + displayReason + "</td></tr>";
                    String html = emailService.buildTemplate("Booking Rejected", "Your booking request was rejected by " + rejecterName + ".", "We regret to inform you that your equipment booking request has been rejected.", details);
                    emailService.sendEmail(saved.getStudent().getEmail(), "SmartLab AI - Booking Rejected: " + eqName, html);
                }

                // Telegram alert
                try {
                    telegramService.sendTelegramMessage("<b>SmartLab AI - Booking Rejected</b>\nEquipment: " + eqName + "\nRejected by: " + rejecterName + "\nReason: " + displayReason);
                } catch (Exception e) {
                    log.warn("Failed to send rejection Telegram alert: {}", e.getMessage());
                }
            } catch (Exception e) {
                log.warn("Failed to notify student of rejection: {}", e.getMessage());
            }
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

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("Cancelled");
            Booking saved = bookingRepository.save(booking);
            try {
                String eqName = saved.getEquipment() != null ? saved.getEquipment().getName() : "Equipment";
                Long notifUserId = saved.getStudent() != null ? (saved.getStudent().getUserId() != null ? saved.getStudent().getUserId() : saved.getStudent().getStudentId()) : null;
                if (notifUserId != null) {
                    notificationService.createNotification(notifUserId, "STUDENT", "Booking Cancelled", "Your booking request for " + eqName + " has been cancelled.", "Booking");
                }
            } catch (Exception e) {}
            return saved;
        }
        return null;
    }
}
