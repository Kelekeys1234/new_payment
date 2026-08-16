package com.example.payment.exception;

/**
 * Thrown when a requested resource (user, payment) cannot be found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
