package com.example.payment.controller;

import com.example.payment.dto.CreateUserRequest;
import com.example.payment.dto.UserPaymentSummary;
import com.example.payment.dto.UserResponse;
import com.example.payment.service.PaymentService;
import com.example.payment.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<UserPaymentSummary> getUserSummary(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getUserSummary(id));
    }

    @GetMapping("/search")
    public ResponseEntity<UserResponse> searchByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(userService.searchByPhone(phone));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
