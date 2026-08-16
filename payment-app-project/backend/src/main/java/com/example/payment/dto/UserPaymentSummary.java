package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated payment summary for a single user, used on the User Details page.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPaymentSummary {
    private UserResponse user;
    private long totalPayments;
    private BigDecimal totalLoans;
    private BigDecimal totalDonations;
    private BigDecimal totalAmount;
    private List<PaymentResponse> payments;
}
