package com.smartlab.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BOOKINGS")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    private String status;
    private Date bookedAt;
    private String purpose;

    @Column(name = "booking_date")
    private java.time.LocalDate bookingDate;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Transient
    private String date;

    @Transient
    private String timeSlot;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Faculty approvedBy;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getTimeSlot() {
        if (startTime != null && endTime != null) {
            return startTime + " - " + endTime;
        }
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
        if (timeSlot != null && timeSlot.contains("-")) {
            String[] parts = timeSlot.split("-");
            if (parts.length >= 2) {
                this.startTime = parts[0].trim();
                this.endTime = parts[1].trim();
            }
        } else {
            this.startTime = timeSlot;
        }
    }

    public String getDate() {
        return bookingDate != null ? bookingDate.toString() : date;
    }

    public void setDate(String date) {
        this.date = date;
        if (date != null && !date.isBlank()) {
            try {
                this.bookingDate = java.time.LocalDate.parse(date.trim());
            } catch (Exception e) {}
        }
    }

    public java.time.LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(java.time.LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Booking() {}

    public Booking(Long bookingId, Student student, Equipment equipment, String status, Date bookedAt, Faculty approvedBy) {
        this.bookingId = bookingId;
        this.student = student;
        this.equipment = equipment;
        this.status = status;
        this.bookedAt = bookedAt;
        this.approvedBy = approvedBy;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(Date bookedAt) {
        this.bookedAt = bookedAt;
    }

    public Faculty getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Faculty approvedBy) {
        this.approvedBy = approvedBy;
    }

    public void setStudentId(Long studentId) {
        if (this.student == null) {
            this.student = new Student();
        }
        this.student.setStudentId(studentId);
    }

    public void setEquipmentId(Long equipmentId) {
        if (this.equipment == null) {
            this.equipment = new Equipment();
        }
        this.equipment.setEquipmentId(equipmentId);
    }

    public Boolean getIsUrgent() {
        return isUrgent;
    }

    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }
}
