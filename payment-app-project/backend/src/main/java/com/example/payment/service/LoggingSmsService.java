package com.example.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Stub SMS sender: logs the OTP instead of calling a real SMS provider. Active whenever
 * {@code app.sms.provider} is unset or "log" (the default) - set it to "termii" to switch
 * to {@link TermiiSmsService} instead.
 */
@Slf4j
@Service
@ConditionalOnProperty(prefix = "app.sms", name = "provider", havingValue = "log", matchIfMissing = true)
public class LoggingSmsService implements SmsService {

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        log.info("[SMS-STUB] OTP for {} is {} (expires in 5 minutes)", phoneNumber, otp);
    }
}
