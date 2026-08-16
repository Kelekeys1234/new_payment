package com.example.payment.dto;

import com.example.payment.model.Currency;
import com.example.payment.model.PaymentMethod;
import com.example.payment.model.PaymentPurpose;
import com.example.payment.model.PaymentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private Long userId;
    private String userName;
    private String phoneNumber;

    // Explicit @JsonProperty is required here: Jackson's default bean-naming convention
    // strips the "is" prefix off boolean getters (isVisitor() -> "visitor"), which would
    // otherwise silently rename this field in the JSON response.
    @JsonProperty("isVisitor")
    private boolean isVisitor;
    private PaymentType paymentType;
    private PaymentMethod paymentMethod;
    private PaymentPurpose paymentPurpose;
    private com.example.payment.model.PaymentFrequency paymentFrequency;
    private BigDecimal amount;
    private Currency currency;
    private String createdBy;
    private LocalDateTime created;
}
