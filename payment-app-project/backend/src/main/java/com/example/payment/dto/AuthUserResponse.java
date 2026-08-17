package com.example.payment.dto;

import com.example.payment.model.MemberType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private MemberType memberType;
    private boolean admin;
    private boolean superAdmin;
}
