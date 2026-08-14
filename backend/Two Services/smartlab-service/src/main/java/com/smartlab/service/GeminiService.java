package com.smartlab.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
    }

    public String generateResponse(String systemInstructionText, String userPrompt, List<Map<String, String>> history) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("GEMINI_API_KEY is not configured or empty. Cannot invoke Gemini API directly.");
            return null;
        }

        try {
            String activeModel = (modelName != null && !modelName.trim().isEmpty()) ? modelName.trim() : "gemini-1.5-flash";
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + activeModel + ":generateContent?key=" + apiKey.trim();

            Map<String, Object> requestBody = new HashMap<>();

            // 1. System Instruction
            if (systemInstructionText != null && !systemInstructionText.trim().isEmpty()) {
                Map<String, Object> systemPart = Map.of("text", systemInstructionText.trim());
                Map<String, Object> systemInstruction = Map.of("parts", List.of(systemPart));
                requestBody.put("system_instruction", systemInstruction);
            }

            // 2. Contents (History + User Prompt)
            List<Map<String, Object>> contents = new ArrayList<>();

            if (history != null && !history.isEmpty()) {
                for (Map<String, String> h : history) {
                    String role = h.get("role");
                    String content = h.get("content");
                    if (content != null && !content.trim().isEmpty()) {
                        String geminiRole = "user".equalsIgnoreCase(role) ? "user" : "model";
                        Map<String, Object> part = Map.of("text", content.trim());
                        contents.add(Map.of("role", geminiRole, "parts", List.of(part)));
                    }
                }
            }

            // Current prompt
            Map<String, Object> currentPart = Map.of("text", userPrompt != null ? userPrompt.trim() : "");
            contents.add(Map.of("role", "user", "parts", List.of(currentPart)));

            requestBody.put("contents", contents);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, entity, Map.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                Map body = responseEntity.getBody();
                List candidates = (List) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map contentMap = (Map) firstCandidate.get("content");
                    if (contentMap != null) {
                        List parts = (List) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map firstPart = (Map) parts.get(0);
                            String text = (String) firstPart.get("text");
                            if (text != null && !text.trim().isEmpty()) {
                                return text.trim();
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Google Gemini API call failed: {}", e.getMessage());
        }

        return null;
    }
}
