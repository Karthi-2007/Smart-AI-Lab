package com.smartlab.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_settings")
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "institution_name", nullable = false)
    private String institutionName = "Karpagam College of Engineering";

    @Column(name = "time_zone", nullable = false)
    private String timeZone = "Asia/Kolkata";

    @Column(name = "opening_time", nullable = false)
    private String openingTime = "09:00";

    @Column(name = "closing_time", nullable = false)
    private String closingTime = "16:00";

    @Column(name = "booking_duration", nullable = false)
    private String bookingDuration = "3 Hours";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public SystemSetting() {}

    public SystemSetting(String institutionName, String timeZone, String openingTime, String closingTime, String bookingDuration) {
        this.institutionName = institutionName;
        this.timeZone = timeZone;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.bookingDuration = bookingDuration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
        this.closingTime = closingTime;
    }

    public String getBookingDuration() {
        return bookingDuration;
    }

    public void setBookingDuration(String bookingDuration) {
        this.bookingDuration = bookingDuration;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
