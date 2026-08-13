package com.smartlab.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.from.number:}")
    private String fromNumber;

    public void sendSms(String toPhone, String message) {
        if (toPhone == null || toPhone.trim().isEmpty()) {
            log.warn("Skipping SMS: recipient phone number is empty");
            return;
        }
        if (accountSid == null || accountSid.trim().isEmpty() ||
            authToken == null || authToken.trim().isEmpty() ||
            fromNumber == null || fromNumber.trim().isEmpty()) {
            log.warn("[SMS SIMULATOR] Twilio credentials not configured. SMS to {}: {}", toPhone, message);
            return;
        }

        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            
            String form = "To=" + java.net.URLEncoder.encode(toPhone, java.nio.charset.StandardCharsets.UTF_8) +
                          "&From=" + java.net.URLEncoder.encode(fromNumber, java.nio.charset.StandardCharsets.UTF_8) +
                          "&Body=" + java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8);

            String authHeader = "Basic " + java.util.Base64.getEncoder().encodeToString(
                    (accountSid + ":" + authToken).getBytes(java.nio.charset.StandardCharsets.UTF_8)
            );

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(form))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("SMS successfully sent to {} via Twilio", toPhone);
            } else {
                log.error("Twilio returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send SMS to {} via Twilio: {}", toPhone, e.getMessage(), e);
        }
    }
}
