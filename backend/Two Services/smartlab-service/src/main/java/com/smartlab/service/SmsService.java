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

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.from.number:}")
    private String fromNumber;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendSms(String toPhone, String message) {
        if (toPhone == null || toPhone.trim().isEmpty()) {
            log.warn("Skipping SMS: recipient phone number is empty");
            return;
        }

        // Clean phone number for Fast2SMS (extract 10-digit number)
        String cleanPhone = toPhone.replaceAll("[^0-9]", "");
        if (cleanPhone.startsWith("91") && cleanPhone.length() == 12) {
            cleanPhone = cleanPhone.substring(2);
        }

        // 1. Try Fast2SMS Provider
        if (fast2smsApiKey != null && !fast2smsApiKey.trim().isEmpty()) {
            sendViaFast2SMS(cleanPhone, message);
            return;
        }

        // 2. Try Twilio Provider
        if (accountSid != null && !accountSid.trim().isEmpty() &&
            authToken != null && !authToken.trim().isEmpty() &&
            fromNumber != null && !fromNumber.trim().isEmpty()) {
            sendViaTwilio(toPhone, message);
            return;
        }

        // 3. Fallback to Simulator Mode
        log.info("[SMS SIMULATOR] Fast2SMS/Twilio credentials not configured. SMS to {}: {}", toPhone, message);
    }

    private void sendViaFast2SMS(String phoneTenDigit, String message) {
        try {
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey.trim()
                       + "&route=q&message=" + encodedMessage
                       + "&numbers=" + phoneTenDigit;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("cache-control", "no-cache")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("SMS successfully sent to {} via Fast2SMS", phoneTenDigit);
            } else {
                log.error("Fast2SMS returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send SMS to {} via Fast2SMS: {}", phoneTenDigit, e.getMessage(), e);
        }
    }

    private void sendViaTwilio(String toPhone, String message) {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            
            String form = "To=" + URLEncoder.encode(toPhone, StandardCharsets.UTF_8) +
                          "&From=" + URLEncoder.encode(fromNumber, StandardCharsets.UTF_8) +
                          "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            String authHeader = "Basic " + java.util.Base64.getEncoder().encodeToString(
                    (accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
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
