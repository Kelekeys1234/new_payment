package com.example.payment.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface EmailService {

    void sendPaymentConfirmationRequest(String toEmail, String payerName, BigDecimal amount, String currency,
                                         LocalDateTime submittedAt, String confirmUrl, String rejectUrl);
}
