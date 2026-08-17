package com.example.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GrantAdminRequest {

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
}
