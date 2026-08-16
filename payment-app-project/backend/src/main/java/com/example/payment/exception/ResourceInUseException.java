package com.example.payment.exception;

/**
 * Thrown when an action is blocked because the target resource is still referenced
 * elsewhere (e.g. deleting a user who still has payment records).
 */
public class ResourceInUseException extends RuntimeException {
    public ResourceInUseException(String message) {
        super(message);
    }
}
