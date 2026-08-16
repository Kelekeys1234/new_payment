package com.example.payment.model;

/**
 * Supported currency codes.
 */
public enum Currency {
    NGN("Nigerian Naira"),
    USD("US Dollar"),
    EUR("Euro"),
    GBP("British Pound");

    private final String displayName;

    Currency(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
