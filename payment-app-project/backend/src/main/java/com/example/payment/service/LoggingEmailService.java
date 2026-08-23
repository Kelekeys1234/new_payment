package com.example.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

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
    public void sendGivingConfirmationRequest(String toEmail, String confirmUrl, String rejectUrl) {
        log.info("[EMAIL-STUB] Giving confirmation request for {} -> confirm: {} | reject: {}",
                toEmail, confirmUrl, rejectUrl);
    }
}
