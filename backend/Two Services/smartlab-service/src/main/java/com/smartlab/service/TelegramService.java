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
public class TelegramService {
    private static final Logger log = LoggerFactory.getLogger(TelegramService.class);

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.chat.id:}")
    private String defaultChatId;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendTelegramMessage(String message) {
        sendTelegramMessage(this.defaultChatId, message);
    }

    public void sendTelegramMessage(String chatId, String message) {
        String targetChatId = (chatId != null && !chatId.trim().isEmpty()) ? chatId.trim() : this.defaultChatId;

        if (botToken == null || botToken.trim().isEmpty() || targetChatId == null || targetChatId.trim().isEmpty()) {
            log.info("[TELEGRAM SIMULATOR] Bot Token or Chat ID not set. Message to {}: {}", targetChatId, message);
            return;
        }

        try {
            String encodedText = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String url = "https://api.telegram.org/bot" + botToken.trim() + "/sendMessage?chat_id=" + targetChatId + "&text=" + encodedText + "&parse_mode=HTML";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Telegram notification successfully sent to Chat ID {}", targetChatId);
            } else {
                log.warn("Telegram API returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send Telegram notification: {}", e.getMessage());
        }
    }
}
