package com.example.payment.service;

public interface EmailService {

    void sendGivingConfirmationRequest(String toEmail, String confirmUrl, String rejectUrl);
}
