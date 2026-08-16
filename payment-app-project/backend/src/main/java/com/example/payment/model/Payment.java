package com.example.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A payment transaction, stored in the "payments" MongoDB collection.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String id; // e.g. PAY-000001

    @Indexed
    private Long userId;

    private boolean visitor;
    private PaymentType paymentType;
    private PaymentPurpose paymentPurpose;
    private PaymentFrequency paymentFrequency;
    private BigDecimal amount;
    private Currency currency;
    private String createdBy;
    private LocalDateTime created;
}
