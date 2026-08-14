package com.smartlab.controller;

import com.smartlab.entity.Booking;
import com.smartlab.entity.Student;
import com.smartlab.entity.Faculty;
import com.smartlab.entity.Equipment;
import com.smartlab.service.BookingService;
import com.smartlab.service.StudentService;
import com.smartlab.service.FacultyService;
import com.smartlab.repository.BookingRepository;
import com.smartlab.repository.EquipmentRepository;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import com.smartlab.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final StudentService studentService;
    private final FacultyService facultyService;
    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;

    public BookingController(
            BookingService bookingService,
            StudentService studentService,
            FacultyService facultyService,
            BookingRepository bookingRepository,
            EquipmentRepository equipmentRepository) {
        this.bookingService = bookingService;
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.bookingRepository = bookingRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long labId,
            @RequestParam(required = false) Long equipmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookedAt").descending());

        Long enforcedDeptId = departmentId;
        if (SecurityUtils.isFaculty()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal != null) {
                Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                if (faculty == null) {
                    faculty = facultyService.getFacultyByEmail(principal.getEmail());
                }
                if (faculty != null && faculty.getDepartmentEntity() != null) {
                    enforcedDeptId = faculty.getDepartmentEntity().getDepartmentId();
                }
            }
        }

        final Long deptIdFilter = enforcedDeptId;
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("student").get("name")), likePattern),
                    cb.like(cb.lower(root.get("equipment").get("name")), likePattern)
                ));
            }
            if (status != null && !status.trim().isEmpty() && !"All".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }
            if (deptIdFilter != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), deptIdFilter));
            }
            if (labId != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("labId"), labId));
            }
            if (equipmentId != null) {
                predicates.add(cb.equal(root.get("equipment").get("equipmentId"), equipmentId));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Booking> bookingPage = bookingRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookingPage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus(status, page, size);
    }

    @GetMapping("/my-bookings/all")
    public ResponseEntity<?> getMyBookingsAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("All", page, size);
    }

    @GetMapping("/my-bookings/pending")
    public ResponseEntity<?> getMyBookingsPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("Pending", page, size);
    }

    @GetMapping("/my-bookings/approved")
    public ResponseEntity<?> getMyBookingsApproved(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("Approved", page, size);
    }

    @GetMapping("/my-bookings/rejected")
    public ResponseEntity<?> getMyBookingsRejected(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("Rejected", page, size);
    }

    @GetMapping("/my-bookings/completed")
    public ResponseEntity<?> getMyBookingsCompleted(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("Completed", page, size);
    }

    @GetMapping("/my-bookings/cancelled")
    public ResponseEntity<?> getMyBookingsCancelled(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return fetchMyBookingsByStatus("Cancelled", page, size);
    }

    // ── Faculty Review Queue Dedicated Endpoints ─────────────────
    @GetMapping("/my-review-queue/all")
    public ResponseEntity<?> getMyReviewQueueAll() {
        return fetchMyReviewQueueByStatus("All");
    }

    @GetMapping("/my-review-queue/pending")
    public ResponseEntity<?> getMyReviewQueuePending() {
        return fetchMyReviewQueueByStatus("Pending");
    }

    @GetMapping("/my-review-queue/approved")
    public ResponseEntity<?> getMyReviewQueueApproved() {
        return fetchMyReviewQueueByStatus("Approved");
    }

    @GetMapping("/my-review-queue/rejected")
    public ResponseEntity<?> getMyReviewQueueRejected() {
        return fetchMyReviewQueueByStatus("Rejected");
    }

    @GetMapping("/my-review-queue/completed")
    public ResponseEntity<?> getMyReviewQueueCompleted() {
        return fetchMyReviewQueueByStatus("Completed");
    }

    // ── Admin Manage Bookings Dedicated Endpoints ────────────────
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAdminBookingsAll() {
        return fetchAdminBookingsByStatus("All");
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<?> getAdminBookingsPending() {
        return fetchAdminBookingsByStatus("Pending");
    }

    @GetMapping("/admin/approved")
    public ResponseEntity<?> getAdminBookingsApproved() {
        return fetchAdminBookingsByStatus("Approved");
    }

    @GetMapping("/admin/rejected")
    public ResponseEntity<?> getAdminBookingsRejected() {
        return fetchAdminBookingsByStatus("Rejected");
    }

    @GetMapping("/admin/completed")
    public ResponseEntity<?> getAdminBookingsCompleted() {
        return fetchAdminBookingsByStatus("Completed");
    }

    private ResponseEntity<?> fetchAdminBookingsByStatus(String status) {
        if (!SecurityUtils.isAdmin() && !SecurityUtils.isFaculty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied. Admin or Faculty role required."));
        }
        return getBookings(null, "All".equalsIgnoreCase(status) ? null : status, null, null, null, 0, 1000);
    }

    private ResponseEntity<?> fetchMyReviewQueueByStatus(String status) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Long deptId = null;
        if (SecurityUtils.isFaculty()) {
            Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
            if (faculty == null) {
                faculty = facultyService.getFacultyByEmail(principal.getEmail());
            }
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                deptId = faculty.getDepartmentEntity().getDepartmentId();
            }
        }

        final Long filterDeptId = deptId;
        final String filterStatus = ("All".equalsIgnoreCase(status) || status == null) ? null : status;

        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (filterDeptId != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), filterDeptId));
            }
            if (filterStatus != null) {
                predicates.add(cb.equal(cb.lower(root.get("status")), filterStatus.toLowerCase()));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        List<Booking> list = bookingRepository.findAll(spec);
        return ResponseEntity.ok(ApiResponse.success("Review queue loaded (" + status + ")", list));
    }

    private ResponseEntity<?> fetchMyBookingsByStatus(String status, int page, int size) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student != null) {
                    predicates.add(cb.equal(root.get("student").get("studentId"), student.getStudentId()));
                } else {
                    predicates.add(cb.equal(root.get("bookingId"), -1L));
                }
            } else if (SecurityUtils.isFaculty()) {
                Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
                if (faculty == null) {
                    faculty = facultyService.getFacultyByEmail(principal.getEmail());
                }
                if (faculty != null && faculty.getDepartmentEntity() != null) {
                    predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), faculty.getDepartmentEntity().getDepartmentId()));
                } else {
                    predicates.add(cb.equal(root.get("bookingId"), -1L));
                }
            }

            if (status != null && !status.trim().isEmpty() && !"All".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by("bookedAt").descending());
        Page<Booking> myBookingsPage = bookingRepository.findAll(spec, pageable);
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved successfully", myBookingsPage));
    }

    @GetMapping({"/student/{studentId}", "/student/{studentId}/bookings-list"})
    public ResponseEntity<?> getBookingsByStudentId(@PathVariable Long studentId) {
        List<Booking> list = bookingService.getBookingsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved for student", list));
    }

    @GetMapping({"/faculty/{facultyId}", "/faculty/{facultyId}/bookings-list"})
    public ResponseEntity<?> getBookingsByFacultyId(@PathVariable Long facultyId) {
        List<Booking> list = bookingRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("approvedBy").get("facultyId"), facultyId)
        );
        return ResponseEntity.ok(ApiResponse.success("Bookings approved by faculty", list));
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<?> getBookingsByEquipmentId(@PathVariable Long equipmentId) {
        List<Booking> list = bookingRepository.findByEquipmentEquipmentId(equipmentId);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved for equipment", list));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBookings(@RequestParam String q) {
        return getBookings(q, null, null, null, null, 0, 1000);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long labId) {
        return getBookings(null, status, departmentId, labId, null, 0, 1000);
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getBookingsByStatusEndpoint(@PathVariable String status) {
        return getBookings(null, status, null, null, null, 0, 1000);
    }

    @GetMapping("/by-date")
    public ResponseEntity<?> getBookingsByDate(@RequestParam String date) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        List<Booking> list = bookingRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("bookingDate"), localDate)
        );
        return ResponseEntity.ok(ApiResponse.success("Bookings loaded for date: " + date, list));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }

        Student student = studentService.getStudentByUserId(principal.getUserId());
        if (student == null) {
            student = studentService.getStudentByEmail(principal.getEmail());
        }
        if (student == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Student profile not found."));
        }
        booking.setStudent(student);

        if (booking.getEquipment() == null || booking.getEquipment().getEquipmentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Equipment details are required."));
        }
        Equipment equipment = equipmentRepository.findById(booking.getEquipment().getEquipmentId()).orElse(null);
        if (equipment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Equipment not found."));
        }
        
        java.time.LocalDate bookingDate = booking.getBookingDate();
        if (bookingDate == null && booking.getDate() != null) {
            try {
                bookingDate = java.time.LocalDate.parse(booking.getDate());
            } catch (Exception e) {}
        }
        
        if (bookingDate != null && booking.getTimeSlot() != null) {
            List<Booking> existing = bookingRepository.findByEquipmentEquipmentIdAndBookingDate(
                equipment.getEquipmentId(), bookingDate
            );
            long activeCount = existing.stream()
                .filter(b -> !"Cancelled".equalsIgnoreCase(b.getStatus()) && !"Rejected".equalsIgnoreCase(b.getStatus()))
                .filter(b -> b.getTimeSlot() != null && b.getTimeSlot().equalsIgnoreCase(booking.getTimeSlot()))
                .count();
            
            int maxQty = equipment.getQuantity() != null ? equipment.getQuantity() : 5;
            if (activeCount >= maxQty) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Selected time slot is fully booked. Maximum quantity reached."));
            }
        }

        Booking saved = bookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Booking created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);

        if (bookingDetails.getStatus() != null) booking.setStatus(bookingDetails.getStatus());
        if (bookingDetails.getPurpose() != null) booking.setPurpose(bookingDetails.getPurpose());
        if (bookingDetails.getTimeSlot() != null) booking.setTimeSlot(bookingDetails.getTimeSlot());
        if (bookingDetails.getDate() != null) booking.setDate(bookingDetails.getDate());

        Booking updated = bookingRepository.save(booking);
        return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", updated));
    }

    @RequestMapping(value = "/{id}/approve", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        Booking updated = bookingService.approveBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking approved successfully", updated));
    }

    @RequestMapping(value = "/{id}/reject", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> rejectBooking(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        String reason = (payload != null && payload.get("reason") != null) ? payload.get("reason") : "No reason specified";
        Booking updated = bookingService.rejectBooking(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", updated));
    }

    @RequestMapping(value = "/{id}/cancel", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        
        if (!SecurityUtils.isAdmin()) {
            UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
            }
            if (SecurityUtils.isStudent()) {
                Student student = studentService.getStudentByUserId(principal.getUserId());
                if (student == null) {
                    student = studentService.getStudentByEmail(principal.getEmail());
                }
                if (student == null || booking.getStudent() == null ||
                    (!student.getStudentId().equals(booking.getStudent().getStudentId()) &&
                     !student.getUserId().equals(booking.getStudent().getUserId()))) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot cancel another user's booking."));
                }
            } else if (SecurityUtils.isFaculty()) {
                checkBookingDepartmentAccess(booking);
            }
        }
        
        Booking updated = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", updated));
    }

    @RequestMapping(value = "/{id}/issue", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> issueBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        Booking updated = bookingService.issueBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking equipment issued successfully", updated));
    }

    @RequestMapping(value = "/{id}/complete", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> completeBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        Booking updated = bookingService.completeBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking completed successfully", updated));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getBookingHistory(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Booking not found"));
        }
        checkBookingDepartmentAccess(booking);
        // Returns audit history (for simple demo: status changes represented by the booking itself)
        return ResponseEntity.ok(ApiResponse.success("Booking history resolved", List.of(booking)));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<Booking> all = bookingRepository.findAll();
        long total = all.size();
        long pending = all.stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count();
        long approved = all.stream().filter(b -> "Approved".equalsIgnoreCase(b.getStatus())).count();
        long rejected = all.stream().filter(b -> "Rejected".equalsIgnoreCase(b.getStatus())).count();
        long completed = all.stream().filter(b -> "Completed".equalsIgnoreCase(b.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("completed", completed);
        return ResponseEntity.ok(ApiResponse.success("Booking statistics loaded", stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking != null) {
            if (!SecurityUtils.isAdmin()) {
                UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
                if (principal == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
                }
                if (SecurityUtils.isStudent()) {
                    Student student = studentService.getStudentByUserId(principal.getUserId());
                    if (student == null) {
                        student = studentService.getStudentByEmail(principal.getEmail());
                    }
                    if (student == null || booking.getStudent() == null ||
                        (!student.getStudentId().equals(booking.getStudent().getStudentId()) &&
                         !student.getUserId().equals(booking.getStudent().getUserId()))) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("You cannot delete another user's booking."));
                    }
                } else if (SecurityUtils.isFaculty()) {
                    checkBookingDepartmentAccess(booking);
                }
            }
            bookingService.deleteBooking(id);
        }
        return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully"));
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

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailability(
            @RequestParam Long equipmentId,
            @RequestParam String date) {
        
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        List<Booking> bookings = bookingRepository.findByEquipmentEquipmentIdAndBookingDate(equipmentId, localDate);
        
        Map<String, Integer> bookedCounts = new java.util.HashMap<>();
        for (Booking b : bookings) {
            if (!"Cancelled".equalsIgnoreCase(b.getStatus()) && !"Rejected".equalsIgnoreCase(b.getStatus())) {
                String slot = b.getTimeSlot();
                if (slot != null && !slot.trim().isEmpty()) {
                    bookedCounts.put(slot, bookedCounts.getOrDefault(slot, 0) + 1);
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Availability map loaded", bookedCounts));
    }

    @GetMapping("/my-review-queue")
    public ResponseEntity<?> getMyReviewQueue(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized"));
        }
        
        Long facultyDeptId = null;
        if (SecurityUtils.isFaculty()) {
            Faculty faculty = facultyService.getFacultyByUserId(principal.getUserId());
            if (faculty == null) {
                faculty = facultyService.getFacultyByEmail(principal.getEmail());
            }
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                facultyDeptId = faculty.getDepartmentEntity().getDepartmentId();
            }
        }
        
        final Long deptId = facultyDeptId;
        Specification<Booking> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(cb.lower(root.get("status")), "pending"));
            
            if (deptId != null) {
                predicates.add(cb.equal(root.get("equipment").get("laboratory").get("department").get("departmentId"), deptId));
            }
            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("student").get("name")), term),
                    cb.like(cb.lower(root.get("equipment").get("name")), term)
                ));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
        
        org.springframework.data.domain.Page<Booking> pageData = bookingRepository.findAll(spec, org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Review queue loaded successfully", pageData));
    }
}
