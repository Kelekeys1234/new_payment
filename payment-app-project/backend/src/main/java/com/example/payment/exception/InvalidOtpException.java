package com.example.payment.exception;

/**
 * Thrown when an OTP code is missing, expired, or does not match.
 */
public class InvalidOtpException extends RuntimeException {
    public InvalidOtpException(String message) {
        super(message);
    }
}
