package com.example.payment.service;

public interface SmsService {

    void sendOtp(String phoneNumber, String otp);
}
