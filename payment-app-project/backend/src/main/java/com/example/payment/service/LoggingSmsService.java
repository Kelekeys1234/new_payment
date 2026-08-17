package com.example.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Stub SMS sender: logs the OTP instead of calling a real SMS provider.
 * Swap in a real provider (Termii, Africa's Talking, Twilio, etc.) by adding
 * another {@link SmsService} implementation - no interface change needed.
 */
@Slf4j
@Service
public class LoggingSmsService implements SmsService {

    @Override
    public void sendOtp(String phoneNumber, String otp) {
        log.info("[SMS-STUB] OTP for {} is {} (expires in 5 minutes)", phoneNumber, otp);
    }
}
