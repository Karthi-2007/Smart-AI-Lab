package com.smartlab.service;

import com.smartlab.entity.*;
import com.smartlab.repository.*;
import com.smartlab.security.SecurityUtils;
import com.smartlab.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);
    private static final String OLLAMA_BASE_URL = "http://localhost:11434";

    private final EquipmentRepository equipmentRepository;
    private final LaboratoryRepository laboratoryRepository;
    private final BookingRepository bookingRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final FaultReportRepository faultReportRepository;
    private final NotificationRepository notificationRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final RestTemplate restTemplate;

    public AiService(EquipmentRepository equipmentRepository,
                      LaboratoryRepository laboratoryRepository,
                      BookingRepository bookingRepository,
                      StudentRepository studentRepository,
                      FacultyRepository facultyRepository,
                      DepartmentRepository departmentRepository,
                      FaultReportRepository faultReportRepository,
                      NotificationRepository notificationRepository,
                      MaintenanceRepository maintenanceRepository) {
        this.equipmentRepository = equipmentRepository;
        this.laboratoryRepository = laboratoryRepository;
        this.bookingRepository = bookingRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.faultReportRepository = faultReportRepository;
        this.notificationRepository = notificationRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Fetch available model tags from local Ollama.
     */
    public List<String> getAvailableModels() {
        List<String> models = new ArrayList<>();
        try {
            String url = OLLAMA_BASE_URL + "/api/tags";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> modelsList = (List<Map<String, Object>>) response.getBody().get("models");
                if (modelsList != null) {
                    for (Map<String, Object> m : modelsList) {
                        String name = (String) m.get("name");
                        if (name != null) {
                            models.add(name);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Local Ollama offline or unreachable at {}: {}", OLLAMA_BASE_URL, e.getMessage());
        }

        if (models.isEmpty()) {
            models.add("llama3");
            models.add("mistral");
            models.add("phi3");
            models.add("gemma");
        }
        return models;
    }

    /**
     * Get chat response from local Ollama with database context injection.
     */
    public Map<String, Object> getChatResponse(String message, List<Map<String, String>> history, String requestedModel) {
        String cleanMsg = message.toLowerCase().trim();

        // 1. Strict Scope Guard
        if (!isInScope(message)) {
            return Map.of(
                "response", "I'm here to assist with the SmartLab application. Please ask me about equipment, bookings, faults, maintenance, users, departments, notifications, reports, or other SmartLab features.",
                "model", requestedModel != null ? requestedModel : "default",
                "source", "SmartLab Scope Guard"
            );
        }

        UserPrincipal principal = SecurityUtils.getCurrentPrincipal();

        // 2. Database/API Aware Intent Routing (with error handling wrapper)
        try {
            if (cleanMsg.equals("hello") || cleanMsg.equals("hi") || cleanMsg.equals("hey") ||
                cleanMsg.startsWith("hello ") || cleanMsg.startsWith("hi ") || cleanMsg.startsWith("hey ") ||
                cleanMsg.contains("good morning") || cleanMsg.contains("good afternoon")) {
                return Map.of(
                    "response", "Hello! I am your Karpagam College of Engineering (KCE) SmartLab AI Assistant. Ask me about equipment availability, lab locations, booking workflows, API endpoints, or database structures!",
                    "model", "smartlab-assistant",
                    "source", "SmartLab Assistant"
                );
            }

            if (cleanMsg.contains("who am i") || cleanMsg.contains("my profile") || cleanMsg.contains("who are you")) {
                return Map.of("response", handleWhoAmIQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }

            // Workflow Queries
            if (cleanMsg.contains("student") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("role") || cleanMsg.contains("action") || cleanMsg.contains("how"))) {
                return Map.of("response", getStudentWorkflowGuide(), "model", "smartlab-assistant", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("faculty") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("role") || cleanMsg.contains("action") || cleanMsg.contains("how"))) {
                return Map.of("response", getFacultyWorkflowGuide(), "model", "smartlab-assistant", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("admin") && (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("step") || cleanMsg.contains("guide") || cleanMsg.contains("role") || cleanMsg.contains("action") || cleanMsg.contains("how"))) {
                return Map.of("response", getAdminWorkflowGuide(), "model", "smartlab-assistant", "source", "SmartLab Workflow Engine");
            }
            if (cleanMsg.contains("workflow") || cleanMsg.contains("process") || cleanMsg.contains("how to use") || cleanMsg.contains("guide")) {
                return Map.of("response", getStudentWorkflowGuide(), "model", "smartlab-assistant", "source", "SmartLab Workflow Engine");
            }

            if (cleanMsg.contains("booking") || cleanMsg.contains("bookings")) {
                return Map.of("response", handleBookingsQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("notification") || cleanMsg.contains("notifications") || cleanMsg.contains("alert") || cleanMsg.contains("alerts")) {
                return Map.of("response", handleNotificationsQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("fault") || cleanMsg.contains("faults")) {
                return Map.of("response", handleFaultsQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("maintenance")) {
                return Map.of("response", handleMaintenanceQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }

            if (cleanMsg.contains("faculty") && (cleanMsg.contains("belong") || cleanMsg.contains("in") || cleanMsg.contains("list") ||
                cleanMsg.contains("cse") || cleanMsg.contains("eee") || cleanMsg.contains("mech") || cleanMsg.contains("department"))) {
                return Map.of("response", handleFacultyQuery(cleanMsg), "model", "database", "source", "SmartLab DB Engine");
            }

            // Specific equipment check FIRST
            if (cleanMsg.contains("is equipment") || cleanMsg.contains("is machine") || cleanMsg.contains("status of equipment") ||
                cleanMsg.contains("equipment #") || cleanMsg.contains("equipment id") ||
                cleanMsg.contains("available in") || cleanMsg.contains("available for") ||
                cleanMsg.contains("available #") ||
                (cleanMsg.contains("available") && equipmentsContainName(cleanMsg)) ||
                (cleanMsg.contains("equipment") && hasNumber(cleanMsg)) ||
                (cleanMsg.contains("machine") && hasNumber(cleanMsg))) {
                return Map.of("response", handleSpecificEquipmentQuery(cleanMsg, principal), "model", "database", "source", "SmartLab DB Engine");
            }

            // General available equipment check SECOND
            if (cleanMsg.contains("available") && (cleanMsg.contains("equipment") || cleanMsg.contains("machine") || cleanMsg.contains("device") || cleanMsg.contains("instrument") || cleanMsg.contains("what") || cleanMsg.contains("which"))) {
                return Map.of("response", handleAvailableEquipmentQuery(principal), "model", "database", "source", "SmartLab DB Engine");
            }
        } catch (Exception dbEx) {
            log.error("SmartLab Database API query failed", dbEx);
            return Map.of(
                "response", "I can't access the SmartLab data right now. Please try again shortly.",
                "model", "database",
                "source", "SmartLab Error Handler"
            );
        }

        // 3. Delegate to Local Python RAG Microservice (http://localhost:8000/ask)
        try {
            String ragUrl = "http://localhost:8000/ask";
            Map<String, Object> ragPayload = Map.of(
                "question", message,
                "model", (requestedModel != null && !requestedModel.trim().isEmpty()) ? requestedModel.trim() : "llama3.1:8b"
            );
            ResponseEntity<Map> ragResponse = restTemplate.postForEntity(ragUrl, ragPayload, Map.class);
            if (ragResponse.getStatusCode().is2xxSuccessful() && ragResponse.getBody() != null) {
                Map<String, Object> body = ragResponse.getBody();
                String answer = (String) body.get("answer");
                String source = (String) body.get("source");
                if (answer != null && !answer.trim().isEmpty()) {
                    return Map.of("response", answer, "model", requestedModel != null ? requestedModel : "llama3.1:8b", "source", source != null ? source : "Ollama Local RAG");
                }
            }
        } catch (Exception ragEx) {
            log.info("Local Python RAG service on port 8000 offline, attempting direct Ollama call: {}", ragEx.getMessage());
        }

        // 4. Fallback to direct Ollama or local rule assistant
        String model = (requestedModel == null || requestedModel.trim().isEmpty()) ? "llama3.1:8b" : requestedModel.trim();
        String systemContext = buildSystemContext();

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemContext));

        if (history != null) {
            for (Map<String, String> entry : history) {
                String role = entry.get("role");
                String content = entry.get("content");
                if (role != null && content != null) {
                    messages.add(Map.of("role", role, "content", content));
                }
            }
        }
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", model);
        payload.put("messages", messages);
        payload.put("stream", false);

        try {
            String url = OLLAMA_BASE_URL + "/api/chat";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, payload, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> messageMap = (Map<String, Object>) response.getBody().get("message");
                if (messageMap != null) {
                    String content = (String) messageMap.get("content");
                    return Map.of("response", content, "model", model, "source", "Ollama Local");
                }
            }
        } catch (Exception e) {
            log.warn("Ollama query failed, executing local fallback rule assistant: {}", e.getMessage());
        }

        String fallbackResponse = buildFallbackResponse(message);
        return Map.of("response", fallbackResponse, "model", model, "source", "SmartLab Rule Fallback (Ollama Offline)");
    }

    private boolean isInScope(String message) {
        if (message == null) return false;
        String clean = message.toLowerCase().trim();

        // 1. Strict out-of-scope keyword blocks
        String[] outOfScopePatterns = {
            "politics", "movie", "film", "actor", "director", "sports", "cricket", "football", "soccer", "basketball",
            "weather", "forecast", "climate", "joke", "tell a joke", "general knowledge", "geography", "history",
            "advice", "personal advice", "recipe", "cook", "how to make", "capital of", "population of",
            "write a python", "write a java", "write a c", "write code", "coding", "programming", "mathematics",
            "integral", "derivative", "solve x", "equation", "theorem", "general purpose", "other projects",
            "weather today", "what is java", "what is python", "what is c++", "what is coding", "how to write code",
            "who wrote", "novels", "literature"
        };

        for (String pattern : outOfScopePatterns) {
            if (clean.contains(pattern)) {
                return false;
            }
        }

        // 2. Strict SmartLab domain keyword inclusions
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
            "what are you", "what is this", "hello", "hi", "hey", "good morning", "good afternoon"
        };

        for (String kw : inScopeKeywords) {
            if (clean.contains(kw)) {
                return true;
            }
        }

        return false;
    }

    private boolean equipmentsContainName(String msg) {
        try {
            List<Equipment> equipments = equipmentRepository.findAll();
            for (Equipment e : equipments) {
                if (msg.contains(e.getName().toLowerCase())) {
                    return true;
                }
            }
        } catch (Exception ignored) {}
        return false;
    }

    private boolean hasNumber(String text) {
        if (text == null) return false;
        for (char c : text.toCharArray()) {
            if (Character.isDigit(c)) {
                return true;
            }
        }
        return false;
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
                return "I don't have enough SmartLab data to answer that accurately. Your student profile could not be found.";
            }
            return "### Your Profile:\n" +
                   "* **Name**: " + student.getName() + "\n" +
                   "* **Email**: " + student.getEmail() + "\n" +
                   "* **Register Number**: " + student.getRegNo() + "\n" +
                   "* **Department**: " + student.getDepartment() + "\n" +
                   "* **Section**: " + (student.getSection() != null ? student.getSection() : "A") + "\n" +
                   "* **Year**: " + student.getYear() + "\n" +
                   "* **Role**: STUDENT\n";
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "I don't have enough SmartLab data to answer that accurately. Your faculty profile could not be found.";
            }
            return "### Your Profile:\n" +
                   "* **Name**: " + faculty.getName() + "\n" +
                   "* **Email**: " + faculty.getEmail() + "\n" +
                   "* **Department**: " + faculty.getDepartment() + "\n" +
                   "* **Designation**: " + (faculty.getDesignation() != null ? faculty.getDesignation() : "Assistant Professor") + "\n" +
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
                return "I don't have enough SmartLab data to answer that accurately.";
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
                  .append(" | Time: ").append(b.getStartTime()).append(" - ").append(b.getEndTime())
                  .append(" | Status: **").append(b.getStatus()).append("**\n");
            }
            return sb.toString();
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty == null) {
                return "I don't have enough SmartLab data to answer that accurately.";
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
                  .append(" | Date: ").append(b.getBookingDate())
                  .append(" | Slot: ").append(b.getStartTime()).append(" - ").append(b.getEndTime())
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
                if (++count >= 20) {
                    sb.append("*...and more bookings exist in the system.*");
                    break;
                }
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
                return "I don't have enough SmartLab data to answer that accurately.";
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
                return "I don't have enough SmartLab data to answer that accurately.";
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
                return "I don't have enough SmartLab data to answer that accurately.";
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
        String role = principal != null ? principal.getRole() : "ANONYMOUS";
        Long userId = principal != null ? principal.getUserId() : null;

        Long deptId = null;
        if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserId(userId);
            if (student != null && student.getDepartmentEntity() != null) {
                deptId = student.getDepartmentEntity().getDepartmentId();
            }
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                deptId = faculty.getDepartmentEntity().getDepartmentId();
            }
        }

        StringBuilder sb = new StringBuilder("Here is the list of available equipment");
        if (deptId != null) {
            sb.append(" in your department:\n\n");
        } else {
            sb.append(":\n\n");
        }

        int count = 0;
        for (Equipment e : equipments) {
            if ("Available".equalsIgnoreCase(e.getStatus())) {
                if (deptId != null) {
                    if (e.getLaboratory() == null || e.getLaboratory().getDepartment() == null ||
                        !deptId.equals(e.getLaboratory().getDepartment().getDepartmentId())) {
                        continue;
                    }
                }
                String labName = e.getLaboratory() != null ? e.getLaboratory().getName() : "General Lab";
                sb.append("* **").append(e.getName()).append("** (ID: #").append(e.getEquipmentId())
                  .append(") in *").append(labName).append("*\n");
                count++;
            }
        }
        if (count == 0) {
            return "There is no available laboratory equipment matching your role's scope at the moment.";
        }
        return sb.toString();
    }

    private String handleSpecificEquipmentQuery(String msg, UserPrincipal principal) {
        List<Equipment> equipments = equipmentRepository.findAll();
        String role = principal != null ? principal.getRole() : "ANONYMOUS";
        Long userId = principal != null ? principal.getUserId() : null;

        Long deptId = null;
        if ("STUDENT".equalsIgnoreCase(role)) {
            Student student = studentRepository.findByUserId(userId);
            if (student != null && student.getDepartmentEntity() != null) {
                deptId = student.getDepartmentEntity().getDepartmentId();
            }
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Faculty faculty = facultyRepository.findByUserId(userId);
            if (faculty != null && faculty.getDepartmentEntity() != null) {
                deptId = faculty.getDepartmentEntity().getDepartmentId();
            }
        }

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

        if (deptId != null) {
            if (found.getLaboratory() == null || found.getLaboratory().getDepartment() == null ||
                !deptId.equals(found.getLaboratory().getDepartment().getDepartmentId())) {
                return "I couldn't find any equipment matching that descriptor in your authorized department scope.";
            }
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

    private String buildSystemContext() {
        List<Laboratory> labs = laboratoryRepository.findAll();
        List<Equipment> equipments = equipmentRepository.findAll();

        long totalCount = equipments.size();
        long availableCount = equipments.stream().filter(e -> "Available".equalsIgnoreCase(e.getStatus())).count();
        long faultyCount = equipments.stream().filter(e -> "Faulty".equalsIgnoreCase(e.getStatus()) || "Under Maintenance".equalsIgnoreCase(e.getStatus())).count();

        StringBuilder sb = new StringBuilder();
        sb.append("You are the official SmartLab AI Assistant at Karpagam College of Engineering (KCE), Coimbatore.\n");
        sb.append("You help students, faculty members, and lab assistants manage laboratory schedules, bookings, and diagnostics.\n\n");

        sb.append("Here is the current real-time laboratory inventory state from the database:\n");
        sb.append("--- Lab Summary ---\n");
        sb.append("- Total Registered Equipment: ").append(totalCount).append("\n");
        sb.append("- Available Equipment: ").append(availableCount).append("\n");
        sb.append("- Faulty/Maintenance Equipment: ").append(faultyCount).append("\n\n");

        sb.append("--- Laboratories List ---\n");
        for (Laboratory l : labs) {
            sb.append("* ID: ").append(l.getLabId()).append(" | Name: ").append(l.getName()).append(" | Location: ").append(l.getLocation()).append("\n");
        }
        sb.append("\n");

        sb.append("--- Equipment Details ---\n");
        int count = 0;
        for (Equipment e : equipments) {
            String labName = e.getLaboratory() != null ? e.getLaboratory().getName() : "Unknown Lab";
            sb.append("* ID: ").append(e.getEquipmentId()).append(" | ").append(e.getName())
              .append(" | Lab: ").append(labName).append(" | Status: ").append(e.getStatus()).append("\n");
            if (++count >= 30) break; // prevent token overflow
        }
        sb.append("\n");

        sb.append("--- Booking Workflow & Rules ---\n");
        sb.append("1. A student submits a booking request for any 'Available' equipment.\n");
        sb.append("2. The status is set to 'Pending' and requires faculty review.\n");
        sb.append("3. Once the Faculty approves the request, the status changes to 'Approved'.\n");
        sb.append("4. At the scheduled time slot, the Student visits the lab. The Lab Assistant scans the Student's QR Access Pass and changes the booking status to 'Issued'. The equipment status changes to 'In Use'.\n");
        sb.append("5. When the student returns the machine, the Lab Assistant marks it 'Completed', and the equipment becomes 'Available' again.\n\n");

        sb.append("Guidelines for your responses:\n");
        sb.append("- Be concise, highly professional, polite, and helpful.\n");
        sb.append("- Direct students to the specific lab location or equipment ID.\n");
        sb.append("- Mention KCE campus resources whenever appropriate.\n");

        return sb.toString();
    }

    private String getStudentWorkflowGuide() {
        return "### 🎓 SmartLab Student Workflow:\n\n" +
               "1. **Explore Available Equipment**:\n" +
               "   - Navigate to **Equipment** to browse all hardware assets available in your department (CSE, EEE, ECE, MECH, etc.).\n" +
               "   - Check machine status, lab location, and specification details.\n\n" +
               "2. **Submit Equipment Booking**:\n" +
               "   - Click **Book Equipment** on any active machine.\n" +
               "   - Select your desired date, time slot (e.g. 09:00 AM - 11:00 AM), and enter project purpose.\n" +
               "   - The booking is created with status **Pending**.\n\n" +
               "3. **Faculty Approval & Notification**:\n" +
               "   - Department faculty members review your request.\n" +
               "   - You will receive an instant notification in your dashboard when your booking is **Approved** or **Rejected**.\n\n" +
               "4. **Lab Check-In & QR Pass Access**:\n" +
               "   - Visit the designated laboratory during your booked time slot.\n" +
               "   - Present your **QR Access Pass** (available under *My Bookings* / *QR Pass Monitor*) to the Lab Assistant.\n" +
               "   - The Assistant scans your pass; the booking changes to **Issued** and equipment to **In Use**.\n\n" +
               "5. **Fault Reporting (If Machinery Fails)**:\n" +
               "   - If you encounter a physical or electrical issue with a machine, go to **Fault Reports** -> **Report Fault**.\n" +
               "   - Describe the defect so technicians and faculty can schedule maintenance.\n\n" +
               "6. **Return & Completion**:\n" +
               "   - Upon finishing your session, return the equipment to the Lab Assistant.\n" +
               "   - The Assistant marks the booking **Completed**, returning the machine to **Available** status.";
    }

    private String getFacultyWorkflowGuide() {
        return "### 👨‍🏫 SmartLab Faculty Workflow:\n\n" +
               "1. **Review & Approve Bookings**:\n" +
               "   - Access **Booking Requests** to view pending student requests in your department.\n" +
               "   - Click the Green Checkmark (`Approve`) or Red Trash (`Reject`) to process requests.\n\n" +
               "2. **Manage Department Laboratories & Hardware**:\n" +
               "   - View all equipment assigned to your department labs.\n" +
               "   - Monitor live status (*Available*, *In Use*, *Under Maintenance*, *Faulty*).\n\n" +
               "3. **Inspect Fault Reports & Schedule Maintenance**:\n" +
               "   - Review incoming student fault reports in your department.\n" +
               "   - Schedule maintenance tasks and assign certified technicians.\n\n" +
               "4. **QR Access Pass Verification**:\n" +
               "   - Monitor lab check-ins via **QR Pass Monitor** when students arrive at the lab.";
    }

    private String getAdminWorkflowGuide() {
        return "### ⚙️ SmartLab Admin Workflow:\n\n" +
               "1. **User Management**:\n" +
               "   - Add, edit, activate, or deactivate **Student** and **Faculty** accounts.\n\n" +
               "2. **Laboratory & Equipment Administration**:\n" +
               "   - Add new departments, laboratories, and hardware assets.\n" +
               "   - Import/Export CSV records.\n\n" +
               "3. **System Overview & Reports**:\n" +
               "   - View comprehensive utilization analytics, fault histories, and audit logs.";
    }

    private String buildFallbackResponse(String userMsg) {
        String msg = userMsg.toLowerCase();

        if (msg.contains("student") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("role") || msg.contains("action") || msg.contains("how"))) {
            return getStudentWorkflowGuide();
        }

        if (msg.contains("faculty") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("role") || msg.contains("action") || msg.contains("how"))) {
            return getFacultyWorkflowGuide();
        }

        if (msg.contains("admin") && (msg.contains("workflow") || msg.contains("process") || msg.contains("step") || msg.contains("guide") || msg.contains("role") || msg.contains("action") || msg.contains("how"))) {
            return getAdminWorkflowGuide();
        }

        if (msg.contains("workflow") || msg.contains("process") || msg.contains("how to use") || msg.contains("guide") || msg.contains("how to book") || msg.contains("booking workflow") || msg.contains("how do i book") || msg.contains("steps to book")) {
            return getStudentWorkflowGuide();
        }

        if (msg.contains("report fault") || msg.contains("how to report") || msg.contains("report a fault") || msg.contains("fault reporting") || msg.contains("fault")) {
            return "### How to Report a Fault in SmartLab:\n\n" +
                   "1. Navigate to the **Faults** section in your dashboard.\n" +
                   "2. Click on **Report Fault**.\n" +
                   "3. Select the equipment from the list, describe the issue, and submit.\n" +
                   "4. Faculty and Administrators will review the report and schedule maintenance as necessary.";
        }

        if (msg.contains("location") || msg.contains("where is") || msg.contains("lab location")) {
            try {
                List<Laboratory> labs = laboratoryRepository.findAll();
                StringBuilder sb = new StringBuilder("### Karpagam College of Engineering (KCE) SmartLab Locations:\n\n");
                for (Laboratory l : labs) {
                    sb.append("* **").append(l.getName()).append("**: ").append(l.getLocation())
                      .append(" (Department: ").append(l.getDepartment().getName()).append(")\n");
                }
                return sb.toString();
            } catch (Exception e) {
                return "KCE Smart Labs are located across the campus. Please check the Laboratories dashboard for specific coordinates.";
            }
        }

        if (msg.contains("notification") || msg.contains("alert")) {
            return "### SmartLab Notifications:\n\n" +
                   "Notifications alert you about booking status changes (approvals, rejections), new fault reports, or scheduled maintenance. You can view them by clicking the Notification icon in your dashboard header.";
        }

        if (msg.contains("dashboard") || msg.contains("what is on my dashboard")) {
            return "### SmartLab Dashboards:\n\n" +
                   "* **Student**: View available equipment in your department, register bookings, report faults, and track notifications.\n" +
                   "* **Faculty**: Approve/reject bookings, manage department faults, schedule maintenance, and view department reports.\n" +
                   "* **Admin**: Full system management of users, departments, labs, equipment, bookings, maintenance, faults, and analytics.";
        }

        return "I'm here to assist with the SmartLab application. Please ask me about equipment, bookings, faults, maintenance, users, departments, notifications, reports, or other SmartLab features.";
    }
}
