package com.example.payment.controller;

import com.example.payment.dto.CreatePaymentRequest;
import com.example.payment.dto.PaymentResponse;
import com.example.payment.dto.UpdatePaymentRequest;
import com.example.payment.security.CurrentUser;
import com.example.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/me")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(@AuthenticationPrincipal CurrentUser currentUser) {
        return ResponseEntity.ok(paymentService.getPaymentsByUserId(currentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable String id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUserId(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PaymentResponse>> search(@RequestParam String query) {
        return ResponseEntity.ok(paymentService.search(query));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestPart("payment") CreatePaymentRequest request,
            @RequestPart("receipt") MultipartFile receipt) {
        PaymentResponse created = paymentService.createPayment(request, receipt);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(@PathVariable String id,
                                                           @Valid @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    // Opened directly from the admin's email client, so these render a plain HTML page
    // rather than JSON.

    @GetMapping(value = "/confirm/{token}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> confirm(@PathVariable String token) {
        paymentService.confirmByToken(token);
        return ResponseEntity.ok(page("Confirmed", "This payment has been marked confirmed."));
    }

    @GetMapping(value = "/reject/{token}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> reject(@PathVariable String token) {
        paymentService.rejectByToken(token);
        return ResponseEntity.ok(page("Marked as not confirmed", "This payment has been marked not confirmed."));
    }

    private String page(String heading, String message) {
        return """
                <!doctype html>
                <html><head><meta charset="utf-8"><title>%s</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 60px 20px;">
                  <h2>%s</h2>
                  <p>%s</p>
                </body></html>
                """.formatted(heading, heading, message);
    }
}
