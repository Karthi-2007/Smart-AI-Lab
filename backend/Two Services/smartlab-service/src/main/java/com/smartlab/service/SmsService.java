package com.smartlab.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class SmsService {
    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendSms(String toPhone, String message) {
        if (toPhone == null || toPhone.trim().isEmpty()) {
            log.warn("Skipping SMS: recipient phone number is empty");
            return;
        }

        // Clean phone number (extract 10-digit number for Fast2SMS)
        String cleanPhone = toPhone.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() == 12) {
            cleanPhone = cleanPhone.substring(2);
        }

        if (fast2smsApiKey == null || fast2smsApiKey.trim().isEmpty()) {
            log.info("[SMS SIMULATOR] Fast2SMS API key not configured. SMS to {}: {}", cleanPhone, message);
            return;
        }

        try {
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey.trim()
                       + "&route=q&message=" + encodedMessage
                       + "&numbers=" + cleanPhone;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("cache-control", "no-cache")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("SMS successfully sent to {} via Fast2SMS", cleanPhone);
            } else {
                log.error("Fast2SMS returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send SMS to {} via Fast2SMS: {}", cleanPhone, e.getMessage(), e);
        }
    }
}
