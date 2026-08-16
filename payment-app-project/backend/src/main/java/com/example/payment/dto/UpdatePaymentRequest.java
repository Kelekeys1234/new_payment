package com.example.payment.dto;

import com.example.payment.model.Currency;
import com.example.payment.model.PaymentPurpose;
import com.example.payment.model.PaymentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Payload for editing an existing payment.
 * <p>
 * The payment's owning user (phone number / linked user) is intentionally not editable
 * here - only the transaction details can be changed.
 */
@Data
public class UpdatePaymentRequest {

    @NotBlank(message = "Created by is required")
    private String createdBy;

    @NotNull(message = "isVisitor is required")
    @JsonProperty("isVisitor")
    private Boolean isVisitor;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Payment purpose is required")
    private PaymentPurpose paymentPurpose;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Currency is required")
    private Currency currency;
}
