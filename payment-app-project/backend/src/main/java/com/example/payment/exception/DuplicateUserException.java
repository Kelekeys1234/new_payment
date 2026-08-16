package com.example.payment.exception;

/**
 * Thrown when attempting to create a user with a phone number that already exists.
 */
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
