package com.example.payment.exception;

/**
 * Thrown on login when the phone number is unregistered, not yet activated, or the
 * password does not match. Kept deliberately generic so failed logins don't leak
 * account-existence information.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
