package com.example.payment.service;

import com.example.payment.exception.SmsDeliveryException;
import com.example.payment.util.PhoneUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Sends OTP codes via Termii's Send Message API (https://developers.termii.com).
 * Active when {@code app.sms.provider=termii}.
 */
@Slf4j
@Service
@ConditionalOnProperty(prefix = "app.sms", name = "provider", havingValue = "termii")
public class TermiiSmsService implements SmsService {

    private final RestClient restClient;
    private final String apiKey;
    private final String senderId;

    public TermiiSmsService(@Value("${app.sms.termii.base-url}") String baseUrl,
                             @Value("${app.sms.termii.api-key}") String apiKey,
                             @Value("${app.sms.termii.sender-id}") String senderId) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.senderId = senderId;
    }

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        String to = PhoneUtils.normalize(phoneNumber).replaceFirst("^\\+", "");
        String message = "Your Nehemiah Builders verification code is " + otp + ". It expires in 5 minutes.";

        Map<String, Object> body = Map.of(
                "to", to,
                "from", senderId,
                "sms", message,
                "type", "plain",
                "channel", "generic",
                "api_key", apiKey
        );

        try {
            restClient.post()
                    .uri("/api/sms/send")
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            throw new SmsDeliveryException("Termii request failed for " + phoneNumber, e);
        }
    }
}
