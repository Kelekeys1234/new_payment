package com.example.payment.dto;

import com.example.payment.model.Currency;
import com.example.payment.model.PaymentPurpose;
import com.example.payment.model.PaymentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Payload for recording a new payment.
 * <p>
 * Note: id and created are intentionally NOT present here - the backend generates/assigns
 * those values. createdBy, however, is supplied by the caller (recorded by whoever is
 * entering the payment).
 * <p>
 * If the phone number does not match an existing user, {@code fullName} must be supplied
 * so a lightweight user record can be created as part of this request (a full registration,
 * with email/address/member type, can be completed later via the registration form).
 */
@Data
public class CreatePaymentRequest {

    @NotBlank(message = "Created by is required")
    private String createdBy;

    // Phone number is optional for visitors; frontend enforces it for non-visitors.
    private String phoneNumber;

    /**
     * Required only when the phone number does not correspond to an existing user.
     */
    private String fullName;

    @NotNull(message = "isVisitor is required")
    @JsonProperty("isVisitor")
    private Boolean isVisitor;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Payment purpose is required")
    private PaymentPurpose paymentPurpose;

    @NotNull(message = "Payment frequency is required")
    private com.example.payment.model.PaymentFrequency paymentFrequency;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Currency is required")
    private Currency currency;
}
