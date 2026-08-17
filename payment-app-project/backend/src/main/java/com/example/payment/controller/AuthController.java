package com.example.payment.controller;

import com.example.payment.dto.ActivateAccountRequest;
import com.example.payment.dto.AuthResponse;
import com.example.payment.dto.AuthStatusResponse;
import com.example.payment.dto.AuthUserResponse;
import com.example.payment.dto.GrantAdminRequest;
import com.example.payment.dto.LoginRequest;
import com.example.payment.dto.MessageResponse;
import com.example.payment.dto.RequestOtpRequest;
import com.example.payment.security.CurrentUser;
import com.example.payment.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/status")
    public ResponseEntity<AuthStatusResponse> status(@RequestParam String phone) {
        return ResponseEntity.ok(authService.status(phone));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<MessageResponse> requestOtp(@Valid @RequestBody RequestOtpRequest request) {
        return ResponseEntity.ok(authService.requestOtp(request.getPhoneNumber()));
    }

    @PostMapping("/activate")
    public ResponseEntity<AuthResponse> activate(@Valid @RequestBody ActivateAccountRequest request) {
        return ResponseEntity.ok(authService.activateAccount(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(@AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(authService.me(currentUser));
    }

    @PostMapping("/grant-admin")
    public ResponseEntity<AuthUserResponse> grantAdmin(@Valid @RequestBody GrantAdminRequest request) {
        return ResponseEntity.ok(authService.grantAdmin(request.getPhoneNumber()));
    }
}
