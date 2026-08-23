package com.example.payment.exception;

/** Thrown when the configured email provider fails to send a message. */
public class EmailDeliveryException extends RuntimeException {
    public EmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
