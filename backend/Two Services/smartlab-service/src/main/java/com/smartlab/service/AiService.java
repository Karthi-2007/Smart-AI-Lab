package com.smartlab.service;

import com.smartlab.entity.*;
import com.smartlab.repository.*;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);
    private static final String UNRELATED_RESPONSE = "I can help only with questions related to the SmartLab AI laboratory management system.";

    private final EquipmentRepository equipmentRepository;
    private final LaboratoryRepository laboratoryRepository;
    private final BookingRepository bookingRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final FaultReportRepository faultReportRepository;
    private final NotificationRepository notificationRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final GeminiService geminiService;

    public AiService(EquipmentRepository equipmentRepository,
                      LaboratoryRepository laboratoryRepository,
                      BookingRepository bookingRepository,
                      StudentRepository studentRepository,
                      FacultyRepository facultyRepository,
                      DepartmentRepository departmentRepository,
                      FaultReportRepository faultReportRepository,
                      NotificationRepository notificationRepository,
                      MaintenanceRepository maintenanceRepository,
                      GeminiService geminiService) {
        this.equipmentRepository = equipmentRepository;
        this.laboratoryRepository = laboratoryRepository;
        this.bookingRepository = bookingRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.faultReportRepository = faultReportRepository;
        this.notificationRepository = notificationRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.geminiService = geminiService;
    }

    /**
     * Return list of supported models (Gemini model).
     */
    public List<String> getAvailableModels() {
        return List.of("gemini-1.5-flash");
    }

    /**
     * Main Chatbot processing method using Google Gemini API with backend DB context injection.
     */
    public Map<String, Object> getChatResponse(String message, List<Map<String, String>> history, String requestedModel) {
        if (message == null || message.trim().isEmpty()) {
            return Map.of("response", UNRELATED_RESPONSE, "source", "SmartLab Scope Guard");
        }

        String cleanMsg = message.toLowerCase().trim();

        // 1. Strict Scope Guard - Reject Unrelated Questions Immediately
        if (!isInScope(message)) {
            return Map.of(
                "response", UNRELATED_RESPONSE,
                "model", "gemini-1.5-flash",
                "source", "SmartLab Scope Guard"
            );
        }

        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();

        // 2. Database Context Gathering (Source of Truth)
        String dbContext = buildDatabaseContext(principal);

        // 3. Build System Instruction for Gemini
        String systemInstruction = buildSystemInstruction(dbContext);

        // 4. Try Google Gemini API
        try {
            String geminiReply = geminiService.generateResponse(systemInstruction, message, history);
            if (geminiReply != null && !geminiReply.trim().isEmpty()) {
                // If Gemini responded with out of scope refusal
                if (geminiReply.toLowerCase().contains("can only help with questions related to the smartlab") ||
                    geminiReply.toLowerCase().contains("only help with questions related to smartlab")) {
                    return Map.of(
                        "response", UNRELATED_RESPONSE,
                        "model", "gemini-1.5-flash",
                        "source", "SmartLab Scope Guard"
                    );
                }

                return Map.of(
                    "response", geminiReply,
                    "model", "gemini-1.5-flash",
                    "source", "Google Gemini AI (SmartLab RAG)"
                );
            }
        } catch (Exception e) {
            log.warn("Gemini API call returned error/fallback: {}", e.getMessage());
        }

        // 5. Direct Database Intent Fallback (if Gemini key missing or network offline)
        try {
            if (cleanMsg.equals("hello") || cleanMsg.equals("hi") || cleanMsg.equals("hey") ||
                cleanMsg.startsWith("hello ") || cleanMsg.startsWith("hi ") || cleanMsg.startsWith("hey ") ||
                cleanMsg.contains("good morning") || cleanMsg.contains("good afternoon")) {
                return Map.of(
                    "response", "Hello! I am your Karpagam College of Engineering (KCE) SmartLab AI Assistant. Ask me about equipment availability, lab locations, booking workflows, fault reporting, or maintenance schedules!",
                    "model", "smartlab-engine",
                    "source", "SmartLab Assistant"
                );
            }

            if (cleanMsg.contains("who am i") || cleanMsg.contains("my profile") || cleanMsg.contains("who are you")) {
                return Map.of("response", handleWhoAmIQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("student") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("how"))) {
                return Map.of("response", getStudentWorkflowGuide(), "model", "smartlab-engine", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("faculty") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("how"))) {
                return Map.of("response", getFacultyWorkflowGuide(), "model", "smartlab-engine", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("admin") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("how"))) {
                return Map.of("response", getAdminWorkflowGuide(), "model", "smartlab-engine", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("how to use") || cleanMsg.contains("guide") || cleanMsg.contains("how to book") || cleanMsg.contains("booking workflow") || cleanMsg.contains("steps to book")) {
                return Map.of("response", getStudentWorkflowGuide(), "model", "smartlab-engine", "source", "SmartLab Workflow Engine");
            }

            if (cleanMsg.contains("booking") || cleanMsg.contains("bookings")) {
                return Map.of("response", handleBookingsQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("notification") || cleanMsg.contains("notifications") || cleanMsg.contains("alert") || cleanMsg.contains("alerts")) {
                return Map.of("response", handleNotificationsQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("fault") || cleanMsg.contains("faults")) {
                return Map.of("response", handleFaultsQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("maintenance")) {
                return Map.of("response", handleMaintenanceQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("faculty") && (cleanMsg.contains("belong") || cleanMsg.contains("in") || cleanMsg.contains("list") ||
                cleanMsg.contains("cse") || cleanMsg.contains("eee") || cleanMsg.contains("mech") || cleanMsg.contains("department"))) {
                return Map.of("response", handleFacultyQuery(cleanMsg), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("available") && (cleanMsg.contains("equipment") || cleanMsg.contains("machine") || cleanMsg.contains("device") || cleanMsg.contains("instrument") || cleanMsg.contains("what") || cleanMsg.contains("which"))) {
                return Map.of("response", handleAvailableEquipmentQuery(principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("equipment") || cleanMsg.contains("machine") || cleanMsg.contains("available")) {
                return Map.of("response", handleSpecificEquipmentQuery(cleanMsg, principal), "model", "smartlab-db", "source", "SmartLab DB Engine");
            }
        } catch (Exception dbEx) {
            log.error("SmartLab Database API query failed", dbEx);
        }

        String fallback = buildFallbackResponse(cleanMsg);
        return Map.of("response", fallback, "model", "gemini-1.5-flash", "source", "SmartLab Rule Fallback (Gemini Offline)");
    }

    private boolean isInScope(String message) {
        if (message == null) return false;
        String clean = message.toLowerCase().trim();

        // 1. Out-of-scope keyword blocks
        String[] outOfScopePatterns = {
            "politics", "president", "prime minister", "movie", "film", "actor", "actress", "director", "cinema", "sports", "cricket", "football", "soccer", "basketball",
            "weather", "forecast", "climate", "temperature", "joke", "tell a joke", "general knowledge", "geography", "history",
            "advice", "personal advice", "recipe", "cook", "how to make", "capital of", "population of",
            "write a python", "write a java", "write a c", "write code", "coding", "programming", "mathematics",
            "integral", "derivative", "solve x", "equation", "theorem", "general purpose", "other projects",
            "weather today", "what is java", "what is python", "what is c++", "what is coding", "how to write code",
            "who wrote", "novels", "literature", "song", "sing"
        };

        for (String pattern : outOfScopePatterns) {
            if (clean.contains(pattern)) {
                return false;
            }
        }

        // 2. SmartLab domain keyword inclusions
        String[] inScopeKeywords = {
            "smartlab", "smart-lab", "kce", "karpagam", "lab", "laboratory", "laboratories", "equipment", "equipments",
            "machine", "machines", "booking", "bookings", "book", "reservation", "reservations", "reserve", "fault",
            "faults", "report", "reports", "maintenance", "technician", "schedule", "schedules", "notification",
            "notifications", "alert", "alerts", "message", "messages", "profile", "profiles", "user", "users",
            "student", "students", "faculty", "faculties", "admin", "admins", "role", "roles", "permission",
            "permissions", "auth", "login", "register", "registration", "otp", "pass", "qr", "available", "availability",
            "status", "device", "devices", "instrument", "instruments", "analytics", "dashboard", "dashboards",
            "active", "activation", "activate", "who am i", "my name", "my email", "my role", "my profile", "my bookings",
            "my notifications", "my faults", "available equipment", "cse", "eee", "mech", "civil", "ece", "aids", "it",
            "department", "departments", "workflow", "workflows", "step", "steps", "assist", "help", "who are you",
            "what are you", "what is this", "hello", "hi", "hey", "good morning", "good afternoon", "predictive"
        };

        for (String kw : inScopeKeywords) {
            if (clean.contains(kw)) {
                return true;
            }
        }

        return false;
    }

    private String buildSystemInstruction(String dbContext) {
        return "You are the SmartLab AI assistant for the SmartLab AI laboratory management system.\n\n" +
               "You must answer only questions related to:\n" +
               "- students\n" +
               "- faculty\n" +
               "- administrators\n" +
               "- departments\n" +
               "- laboratories\n" +
               "- equipment\n" +
               "- equipment booking\n" +
               "- booking approval/rejection\n" +
               "- fault reports\n" +
               "- maintenance\n" +
               "- notifications\n" +
               "- OTP\n" +
               "- email/SMS notifications\n" +
               "- AI analytics\n" +
               "- predictive maintenance\n" +
               "- SmartLab workflows\n" +
               "- SmartLab APIs/features\n" +
               "- SmartLab project architecture\n\n" +
               "CRITICAL RULES:\n" +
               "1. Do not answer unrelated questions (e.g. general coding, politics, weather, jokes, movies, sports).\n" +
               "2. If a question is unrelated to SmartLab, politely say: 'I can help only with questions related to the SmartLab AI laboratory management system.'\n" +
               "3. Do not invent SmartLab data. Use the provided real-time database context below as the true facts.\n" +
               "4. If you do not have enough information, say that the information is not available rather than making up an answer.\n\n" +
               "REAL-TIME SMARTLAB DATABASE CONTEXT:\n" +
               dbContext;
    }

    private String buildDatabaseContext(UserPrincipal principal) {
        StringBuilder sb = new StringBuilder();
        try {
            List<Laboratory> labs = laboratoryRepository.findAll();
            List<Equipment> equipments = equipmentRepository.findAll();

            long totalCount = equipments.size();
            long availableCount = equipments.stream().filter(e -> "Available".equalsIgnoreCase(e.getStatus())).count();
            long faultyCount = equipments.stream().filter(e -> "Faulty".equalsIgnoreCase(e.getStatus()) || "Under Maintenance".equalsIgnoreCase(e.getStatus())).count();

            sb.append("--- Lab Summary ---\n");
            sb.append("- Total Equipment: ").append(totalCount).append("\n");
            sb.append("- Available Equipment: ").append(availableCount).append("\n");
            sb.append("- Faulty/Maintenance Equipment: ").append(faultyCount).append("\n\n");

            if (principal != null) {
                sb.append("--- Authenticated User Context ---\n");
                sb.append("- Role: ").append(principal.getRole()).append("\n");
                sb.append("- User ID: ").append(principal.getUserId()).append("\n");
                sb.append("- Email: ").append(principal.getEmail()).append("\n\n");
            }

            sb.append("--- Laboratories List ---\n");
            for (Laboratory l : labs) {
                String dept = l.getDepartment() != null ? l.getDepartment().getName() : "General";
                sb.append("* ID: ").append(l.getLabId()).append(" | Name: ").append(l.getName())
                  .append(" | Dept: ").append(dept).append(" | Location: ").append(l.getLocation()).append("\n");
            }
            sb.append("\n");

            sb.append("--- Equipment Inventory ---\n");
            int count = 0;
            for (Equipment e : equipments) {
                String labName = e.getLaboratory() != null ? e.getLaboratory().getName() : "General Lab";
                String deptName = (e.getLaboratory() != null && e.getLaboratory().getDepartment() != null) 
                        ? e.getLaboratory().getDepartment().getName() : "General";
                sb.append("* ID: #").append(e.getEquipmentId()).append(" | ").append(e.getName())
                  .append(" | Dept: ").append(deptName).append(" | Lab: ").append(labName)
                  .append(" | Status: ").append(e.getStatus()).append(" | Qty: ").append(e.getQuantity()).append("\n");
                if (++count >= 30) break;
            }
        } catch (Exception e) {
            sb.append("Database context currently unavailable.\n");
        }
        return sb.toString();
    }

    private String handleWhoAmIQuery(UserPrincipal principal) {
        if (principal == null) {
            return "You are not currently logged in. Please log in to view your profile.";
        }
        String role = principal.getRole();
        Long userId = principal.getUserId();

        if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserId(userId);
            if (student == null) {
                return "Your student profile could not be found in the database.";
            }
            return "### Your Profile:\n" +
                   "* **Name**: " + student.getName() + "\n" +
                   "* **Email**: " + student.getEmail() + "\n" +
                   "* **Register Number**: " + student.getRegNo() + "\n" +
                   "* **Department**: " + student.getDepartment() + "\n" +
                   "* **Role**: STUDENT\n";
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "Your faculty profile could not be found in the database.";
            }
            return "### Your Profile:\n" +
                   "* **Name**: " + faculty.getName() + "\n" +
                   "* **Email**: " + faculty.getEmail() + "\n" +
                   "* **Department**: " + faculty.getDepartment() + "\n" +
                   "* **Role**: FACULTY\n";
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            return "### Your Profile:\n" +
                   "* **Name**: System Admin\n" +
                   "* **Email**: " + principal.getEmail() + "\n" +
                   "* **Role**: ADMIN\n";
        }
        return "You are logged in with role: " + role;
    }

    private String handleBookingsQuery(UserPrincipal principal) {
        if (principal == null) {
            return "Please log in to view your bookings.";
        }
        String role = principal.getRole();
        Long userId = principal.getUserId();

        if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserId(userId);
            if (student == null) {
                return "Student record not found.";
            }
            List<Booking> bookings = bookingRepository.findByStudentStudentId(student.getStudentId());
            if (bookings.isEmpty()) {
                return "You do not have any active bookings at the moment.";
            }
            StringBuilder sb = new StringBuilder("Here are your current bookings:\n\n");
            for (Booking b : bookings) {
                sb.append("* Booking ID: #").append(b.getBookingId())
                  .append(" | Equipment: ").append(b.getEquipment().getName())
                  .append(" | Date: ").append(b.getBookingDate())
                  .append(" | Slot: ").append(b.getTimeSlot())
                  .append(" | Status: **").append(b.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "Faculty record not found.";
            }
            List<Booking> bookings = bookingRepository.findByEquipmentLaboratoryDepartmentDepartmentId(
                    faculty.getDepartmentEntity().getDepartmentId());
            if (bookings.isEmpty()) {
                return "There are no bookings for your department at the moment.";
            }
            StringBuilder sb = new StringBuilder("Here are the bookings for your department:\n\n");
            for (Booking b : bookings) {
                sb.append("* Booking ID: #").append(b.getBookingId())
                  .append(" | Student: ").append(b.getStudent().getName())
                  .append(" | Equipment: ").append(b.getEquipment().getName())
                  .append(" | Slot: ").append(b.getTimeSlot())
                  .append(" | Status: **").append(b.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            List<Booking> bookings = bookingRepository.findAll();
            if (bookings.isEmpty()) {
                return "There are no bookings registered in the system.";
            }
            StringBuilder sb = new StringBuilder("Here are all active bookings in the system:\n\n");
            int count = 0;
            for (Booking b : bookings) {
                sb.append("* ID: #").append(b.getBookingId())
                  .append(" | Student: ").append(b.getStudent().getName())
                  .append(" | Equipment: ").append(b.getEquipment().getName())
                  .append(" | Status: **").append(b.getStatus()).append("**\n");
                if (++count >= 20) break;
            }
            return sb.toString();
        }
        return "You do not have permission to view bookings.";
    }

    private String handleNotificationsQuery(UserPrincipal principal) {
        if (principal == null) {
            return "Please log in to view your notifications.";
        }
        List<Notification> notifications = notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(
                principal.getUserId(), principal.getRole().toUpperCase());
        if (notifications.isEmpty()) {
            return "You have no notifications at the moment.";
        }
        StringBuilder sb = new StringBuilder("Here are your recent notifications:\n\n");
        int count = 0;
        for (Notification n : notifications) {
            sb.append("* **").append(n.getTitle()).append("**: ").append(n.getMessage())
              .append(" (").append(n.getType()).append(")\n");
            if (++count >= 10) break;
        }
        return sb.toString();
    }

    private String handleFaultsQuery(UserPrincipal principal) {
        if (principal == null) {
            return "Please log in to view fault reports.";
        }
        String role = principal.getRole();
        Long userId = principal.getUserId();

        if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserId(userId);
            if (student == null) {
                return "Student record not found.";
            }
            List<FaultReport> faults = faultReportRepository.findByReportedByStudentId(student.getStudentId());
            if (faults.isEmpty()) {
                return "You have not reported any faults.";
            }
            StringBuilder sb = new StringBuilder("Here are the fault reports submitted by you:\n\n");
            for (FaultReport f : faults) {
                sb.append("* Fault ID: #").append(f.getFaultId())
                  .append(" | Equipment: ").append(f.getEquipment().getName())
                  .append(" | Issue: ").append(f.getDescription())
                  .append(" | Status: **").append(f.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "Faculty record not found.";
            }
            List<FaultReport> faults = faultReportRepository.findByEquipmentLaboratoryDepartmentDepartmentId(
                    faculty.getDepartmentEntity().getDepartmentId());
            if (faults.isEmpty()) {
                return "There are no fault reports for your department.";
            }
            StringBuilder sb = new StringBuilder("Here are the fault reports for your department:\n\n");
            for (FaultReport f : faults) {
                sb.append("* ID: #").append(f.getFaultId())
                  .append(" | Equipment: ").append(f.getEquipment().getName())
                  .append(" | Issue: ").append(f.getDescription())
                  .append(" | Status: **").append(f.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            List<FaultReport> faults = faultReportRepository.findAll();
            if (faults.isEmpty()) {
                return "There are no fault reports in the system.";
            }
            StringBuilder sb = new StringBuilder("Here are all fault reports in the system:\n\n");
            int count = 0;
            for (FaultReport f : faults) {
                sb.append("* ID: #").append(f.getFaultId())
                  .append(" | Equipment: ").append(f.getEquipment().getName())
                  .append(" | Status: **").append(f.getStatus()).append("**\n");
                if (++count >= 20) break;
            }
            return sb.toString();
        }
        return "You do not have permission to view fault reports.";
    }

    private String handleMaintenanceQuery(UserPrincipal principal) {
        if (principal == null) {
            return "Please log in to view maintenance records.";
        }
        String role = principal.getRole();
        Long userId = principal.getUserId();

        if ("STUDENT".equalsIgnoreCase(role)) {
            return "Only Faculty and Admin roles can manage maintenance schedules.";
        }

        if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "Faculty record not found.";
            }
            List<Maintenance> records = maintenanceRepository.findByEquipmentLaboratoryDepartmentDepartmentId(
                    faculty.getDepartmentEntity().getDepartmentId());
            if (records.isEmpty()) {
                return "There are no maintenance records scheduled for your department.";
            }
            StringBuilder sb = new StringBuilder("Here are the maintenance schedules for your department:\n\n");
            for (Maintenance m : records) {
                sb.append("* ID: #").append(m.getMaintenanceId())
                  .append(" | Equipment: ").append(m.getEquipment().getName())
                  .append(" | Tech: ").append(m.getTechnician() != null ? m.getTechnician() : "Unassigned")
                  .append(" | Date: ").append(m.getScheduledDate())
                  .append(" | Status: **").append(m.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            List<Maintenance> records = maintenanceRepository.findAll();
            if (records.isEmpty()) {
                return "There are no maintenance records registered.";
            }
            StringBuilder sb = new StringBuilder("Here are all maintenance schedules in the system:\n\n");
            int count = 0;
            for (Maintenance m : records) {
                sb.append("* ID: #").append(m.getMaintenanceId())
                  .append(" | Equipment: ").append(m.getEquipment().getName())
                  .append(" | Status: **").append(m.getStatus()).append("**\n");
                if (++count >= 20) break;
            }
            return sb.toString();
        }
        return "You do not have permission to view maintenance schedules.";
    }

    private String handleAvailableEquipmentQuery(UserPrincipal principal) {
        List<Equipment> equipments = equipmentRepository.findAll();
        StringBuilder sb = new StringBuilder("Here is the list of available equipment:\n\n");
        int count = 0;
        for (Equipment e : equipments) {
            if ("Available".equalsIgnoreCase(e.getStatus())) {
                String labName = e.getLaboratory() != null ? e.getLaboratory().getName() : "General Lab";
                sb.append("* **").append(e.getName()).append("** (ID: #").append(e.getEquipmentId())
                  .append(") in *").append(labName).append("*\n");
                count++;
            }
        }
        if (count == 0) {
            return "There is no available laboratory equipment at the moment.";
        }
        return sb.toString();
    }

    private String handleSpecificEquipmentQuery(String msg, UserPrincipal principal) {
        List<Equipment> equipments = equipmentRepository.findAll();
        Equipment found = null;
        for (Equipment e : equipments) {
            if (msg.contains("id " + e.getEquipmentId()) || msg.contains("#" + e.getEquipmentId()) ||
                msg.contains("equipment " + e.getEquipmentId()) || msg.contains(" " + e.getEquipmentId() + " ")) {
                found = e;
                break;
            }
        }
        if (found == null) {
            for (Equipment e : equipments) {
                if (msg.contains(e.getName().toLowerCase())) {
                    found = e;
                    break;
                }
            }
        }

        if (found == null) {
            return "I couldn't find any equipment matching that descriptor in the SmartLab inventory.";
        }

        String labName = found.getLaboratory() != null ? found.getLaboratory().getName() : "Unknown Lab";
        String location = found.getLaboratory() != null ? found.getLaboratory().getLocation() : "Unknown Location";

        return "### Equipment Details:\n" +
               "* **Name**: " + found.getName() + "\n" +
               "* **ID**: #" + found.getEquipmentId() + "\n" +
               "* **Category**: " + (found.getCategory() != null ? found.getCategory() : "General") + "\n" +
               "* **Status**: **" + found.getStatus() + "**\n" +
               "* **Lab**: " + labName + " (Location: " + location + ")\n";
    }

    private String handleFacultyQuery(String msg) {
        Department dept = findDepartmentByText(msg);
        if (dept == null) {
            return "Please specify a valid department code or name (e.g. CSE, EEE, MECH) to look up faculty members.";
        }
        List<Faculty> facultyList = facultyRepository.findAll();
        StringBuilder sb = new StringBuilder("Here are the faculty members belonging to the **")
                .append(dept.getName()).append("** department:\n\n");
        int count = 0;
        for (Faculty f : facultyList) {
            if (f.getDepartmentEntity() != null &&
                dept.getDepartmentId().equals(f.getDepartmentEntity().getDepartmentId())) {
                sb.append("* **").append(f.getName()).append("** - ").append(f.getDesignation() != null ? f.getDesignation() : "Assistant Professor").append("\n");
                count++;
            }
        }
        if (count == 0) {
            return "There are no faculty profiles registered in the " + dept.getName() + " department.";
        }
        return sb.toString();
    }

    private Department findDepartmentByText(String text) {
        if (text == null) return null;
        String clean = text.toLowerCase();
        List<Department> depts = departmentRepository.findAll();
        for (Department d : depts) {
            if (clean.contains(d.getCode().toLowerCase()) || clean.contains(d.getName().toLowerCase())) {
                return d;
            }
        }
        if (clean.contains("cse") || clean.contains("computer science")) {
            return depts.stream().filter(d -> d.getCode().equalsIgnoreCase("CSE-ECE") || d.getCode().equalsIgnoreCase("CSE")).findFirst().orElse(null);
        }
        if (clean.contains("eee") || clean.contains("electrical")) {
            return depts.stream().filter(d -> d.getCode().equalsIgnoreCase("EEE")).findFirst().orElse(null);
        }
        if (clean.contains("mech") || clean.contains("mechanical")) {
            return depts.stream().filter(d -> d.getCode().equalsIgnoreCase("MECH")).findFirst().orElse(null);
        }
        return null;
    }

    private String getStudentWorkflowGuide() {
        return "### 🎓 SmartLab Student Workflow:\n\n" +
               "1. **Explore Available Equipment**:\n" +
               "   - Navigate to **Equipment** to browse hardware assets available in your department.\n" +
               "   - Check machine status, lab location, and specification details.\n\n" +
               "2. **Submit Equipment Booking**:\n" +
               "   - Click **Book Equipment** on any active machine.\n" +
               "   - Select your desired date, time slot (e.g. 09:00 AM - 11:00 AM), and enter project purpose.\n" +
               "   - The booking is created with status **Pending**.\n\n" +
               "3. **Faculty Approval & Notification**:\n" +
               "   - Department faculty members review your request.\n" +
               "   - You will receive an instant notification when your booking is **Approved** or **Rejected**.\n\n" +
               "4. **Lab Check-In & QR Pass Access**:\n" +
               "   - Visit the designated laboratory during your booked time slot.\n" +
               "   - Present your **QR Access Pass** (under *My Bookings*) to the Lab Assistant.\n" +
               "   - The Assistant scans your pass; status updates to **Issued** and equipment to **In Use**.\n\n" +
               "5. **Fault Reporting**:\n" +
               "   - If you encounter a machine fault, go to **Fault Reports** -> **Report Fault**.\n\n" +
               "6. **Completion**:\n" +
               "   - Return the equipment; the Assistant marks the booking **Completed**.";
    }

    private String getFacultyWorkflowGuide() {
        return "### 👨‍🏫 SmartLab Faculty Workflow:\n\n" +
               "1. **Review & Approve Bookings**:\n" +
               "   - Access **Booking Requests** to view pending student requests in your department.\n" +
               "   - Click **Approve** or **Reject** to process requests.\n\n" +
               "2. **Manage Department Laboratories & Hardware**:\n" +
               "   - View all equipment assigned to your department labs.\n" +
               "   - Monitor live status (*Available*, *In Use*, *Under Maintenance*, *Faulty*).\n\n" +
               "3. **Inspect Fault Reports & Schedule Maintenance**:\n" +
               "   - Review incoming student fault reports in your department.\n" +
               "   - Schedule maintenance tasks and assign certified technicians.";
    }

    private String getAdminWorkflowGuide() {
        return "### ⚙️ SmartLab Admin Workflow:\n\n" +
               "1. **User Management**:\n" +
               "   - Add, edit, activate, or deactivate **Student** and **Faculty** accounts.\n\n" +
               "2. **Laboratory & Equipment Administration**:\n" +
               "   - Add new departments, laboratories, and hardware assets.\n\n" +
               "3. **System Overview & Reports**:\n" +
               "   - View comprehensive utilization analytics, fault histories, and audit logs.";
    }

    private String buildFallbackResponse(String userMsg) {
        String msg = userMsg.toLowerCase();

        if (msg.contains("student") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("how"))) {
            return getStudentWorkflowGuide();
        }

        if (msg.contains("faculty") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("how"))) {
            return getFacultyWorkflowGuide();
        }

        if (msg.contains("admin") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("how"))) {
            return getAdminWorkflowGuide();
        }

        if (msg.contains("workflow") || msg.contains("process") || msg.contains("how to use") || msg.contains("guide") || msg.contains("how to book") || msg.contains("booking workflow") || msg.contains("how do i book")) {
            return getStudentWorkflowGuide();
        }

        if (msg.contains("report fault") || msg.contains("how to report") || msg.contains("report a fault") || msg.contains("fault reporting") || msg.contains("fault")) {
            return "### How to Report a Fault in SmartLab:\n\n" +
                   "1. Navigate to **Faults** in your dashboard.\n" +
                   "2. Click on **Report Fault**.\n" +
                   "3. Select the equipment from the list, describe the issue, and submit.\n" +
                   "4. Faculty and Administrators will review the report and schedule maintenance as necessary.";
        }

        if (msg.contains("predictive") || msg.contains("ai analytics") || msg.contains("analytics")) {
            return "### SmartLab Predictive Maintenance & AI Analytics:\n\n" +
                   "SmartLab AI monitors hardware usage metrics, fault history, and maintenance intervals to predict equipment degradation. The AI Analytics dashboard displays real-time health scores, estimated failure probabilities, and automated maintenance recommendations.";
        }

        return UNRELATED_RESPONSE;
    }
}
