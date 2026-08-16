package com.example.payment.dto;

import com.example.payment.model.MemberType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private MemberType memberType;
    private String createdBy;
    private LocalDateTime created;
}
