package com.example.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
public class PaymentNotificationService {

    private final EmailService emailService;

    @Value("${app.public-base-url}")
    private String publicBaseUrl;

    @Value("${app.giving.admin-email}")
    private String adminEmail;

    public PaymentNotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    public void notifyAdmin(String paymentId, String confirmationToken, String payerName, BigDecimal amount,
                            String currency, LocalDateTime submittedAt) {
        String confirmUrl = publicBaseUrl + "/api/payments/confirm/" + confirmationToken;
        String rejectUrl = publicBaseUrl + "/api/payments/reject/" + confirmationToken;
        try {
            emailService.sendPaymentConfirmationRequest(adminEmail, payerName, amount, currency,
                    submittedAt, confirmUrl, rejectUrl);
        } catch (Exception e) {
            log.error("Failed to send payment confirmation email for payment {}: {}", paymentId,
                    e.getMessage(), e);
        }
    }
}
