package com.example.payment.dto;

import com.example.payment.model.MemberType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Payload for editing an existing user's registration details.
 */
@Data
public class UpdateUserRequest {

    @NotBlank(message = "Created by is required")
    private String createdBy;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^\\+?[0-9]{7,15}$",
            message = "Phone number must contain only digits (optionally prefixed with +) and be 7-15 digits long"
    )
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Member/Worker is required")
    private MemberType memberType;
}
