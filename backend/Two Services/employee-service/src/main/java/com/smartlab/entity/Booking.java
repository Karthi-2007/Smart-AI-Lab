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
    private String timeSlot;
    private String date;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Faculty approvedBy;

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
}
