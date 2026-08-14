package com.smartlab.controller;

import com.smartlab.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Get list of supported Gemini AI models.
     */
    @GetMapping("/models")
    public ResponseEntity<List<String>> getAvailableModels() {
        return ResponseEntity.ok(aiService.getAvailableModels());
    }

    /**
     * POST endpoint for SmartLab AI Chatbot powered by Google Gemini API.
     * Supports both /chat and /message endpoints.
     */
    @PostMapping({"/chat", "/message"})
    public ResponseEntity<Map<String, Object>> chatWithAi(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "response", "Message content is required.",
                "source", "SmartLab Validation"
            ));
        }

        List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");
        String model = (String) request.get("model");

        Map<String, Object> response = aiService.getChatResponse(message, history, model);
        return ResponseEntity.ok(response);
    }
}
