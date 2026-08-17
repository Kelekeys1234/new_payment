package com.example.payment.exception;

/** Thrown when the configured SMS provider fails to deliver an OTP message. */
public class SmsDeliveryException extends RuntimeException {
    public SmsDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
