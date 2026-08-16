package com.example.payment.model;

/**
 * How the payment was made.
 */
public enum PaymentType {
    BANK_TRANSFER("Bank Transfer"),
    CASH("Cash"),
    CARD("Card"),
    MOBILE_MONEY("Mobile Money"),
    OTHER("Other");

    private final String label;

    PaymentType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
