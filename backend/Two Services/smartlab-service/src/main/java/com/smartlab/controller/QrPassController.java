package com.smartlab.controller;

import com.smartlab.entity.Booking;
import com.smartlab.repository.BookingRepository;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/business/qr-passes")
public class QrPassController {

    private final BookingRepository bookingRepository;

    public QrPassController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getQrPassesAll() {
        return fetchQrPassesByStatus(null);
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getQrPassesApproved() {
        return fetchQrPassesByStatus("Approved");
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getQrPassesPending() {
        return fetchQrPassesByStatus("Pending");
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getQrPassesCompleted() {
        return fetchQrPassesByStatus("Completed");
    }

    private ResponseEntity<?> fetchQrPassesByStatus(String status) {
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (status != null && !status.trim().isEmpty() && !"All".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<Booking> list = bookingRepository.findAll(spec);
        return ResponseEntity.ok(ApiResponse.success("QR Passes retrieved (" + (status != null ? status : "All") + ")", list));
    }
}
