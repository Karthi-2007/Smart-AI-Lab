package com.smartlab.service;

import com.smartlab.entity.SystemSetting;
import com.smartlab.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingService {

    @Autowired
    private SystemSettingRepository repository;

    @Transactional
    public SystemSetting getSettings() {
        return repository.findFirstByOrderByIdAsc().orElseGet(() -> {
            SystemSetting defaults = new SystemSetting(
                    "Karpagam College of Engineering",
                    "Asia/Kolkata",
                    "09:00",
                    "16:00",
                    "3 Hours"
            );
            return repository.save(defaults);
        });
    }

    @Transactional
    public SystemSetting updateSettings(SystemSetting request) {
        SystemSetting existing = getSettings();
        if (request.getInstitutionName() != null && !request.getInstitutionName().trim().isEmpty()) {
            existing.setInstitutionName(request.getInstitutionName().trim());
        }
        if (request.getTimeZone() != null && !request.getTimeZone().trim().isEmpty()) {
            existing.setTimeZone(request.getTimeZone().trim());
        }
        if (request.getOpeningTime() != null && !request.getOpeningTime().trim().isEmpty()) {
            existing.setOpeningTime(request.getOpeningTime().trim());
        }
        if (request.getClosingTime() != null && !request.getClosingTime().trim().isEmpty()) {
            existing.setClosingTime(request.getClosingTime().trim());
        }
        if (request.getBookingDuration() != null && !request.getBookingDuration().trim().isEmpty()) {
            existing.setBookingDuration(request.getBookingDuration().trim());
        }
        return repository.save(existing);
    }
}
