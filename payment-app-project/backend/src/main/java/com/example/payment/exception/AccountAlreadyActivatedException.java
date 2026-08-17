package com.example.payment.exception;

/**
 * Thrown when requesting an OTP or activating an account that already has a password set.
 */
public class AccountAlreadyActivatedException extends RuntimeException {
    public AccountAlreadyActivatedException(String message) {
        super(message);
    }
}
