package com.example.payment.dto;

import com.example.payment.model.GivingIntentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GivingIntentResponse {
    private String token;
    private GivingIntentStatus status;
}
