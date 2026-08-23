package com.example.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Stub email sender: logs the confirm/reject links instead of calling a real mail server.
 * Active whenever {@code app.mail.provider} is unset or "log" (the default) - set it to
 * "smtp" once real SMTP credentials are configured to switch to {@link SmtpEmailService}.
 */
@Slf4j
@Service
@ConditionalOnProperty(prefix = "app.mail", name = "provider", havingValue = "log", matchIfMissing = true)
public class LoggingEmailService implements EmailService {

    @Override
    public void sendPaymentConfirmationRequest(String toEmail, String payerName, BigDecimal amount, String currency,
                                                LocalDateTime submittedAt, String confirmUrl, String rejectUrl) {
        log.info("[EMAIL-STUB] Payment confirmation for {} - {} paid {} {} at {} -> confirm: {} | reject: {}",
                toEmail, payerName, amount, currency, submittedAt, confirmUrl, rejectUrl);
    }
}
