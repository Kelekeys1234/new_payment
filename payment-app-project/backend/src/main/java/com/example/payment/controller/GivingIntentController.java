package com.example.payment.controller;

import com.example.payment.dto.GivingIntentResponse;
import com.example.payment.service.GivingIntentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/giving-intents")
@RequiredArgsConstructor
public class GivingIntentController {

    private final GivingIntentService givingIntentService;

    @PostMapping
    public ResponseEntity<GivingIntentResponse> create() {
        return ResponseEntity.status(HttpStatus.CREATED).body(givingIntentService.create());
    }

    @GetMapping("/{token}/status")
    public ResponseEntity<GivingIntentResponse> status(@PathVariable String token) {
        return ResponseEntity.ok(givingIntentService.getStatus(token));
    }

    // Confirm/reject are opened directly from the admin's email client, so they render a
    // plain HTML page rather than JSON.

    @GetMapping(value = "/{token}/confirm", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> confirm(@PathVariable String token) {
        givingIntentService.confirm(token);
        return ResponseEntity.ok(page("Confirmed", "The member has been let through to the payment details form."));
    }

    @GetMapping(value = "/{token}/reject", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> reject(@PathVariable String token) {
        givingIntentService.reject(token);
        return ResponseEntity.ok(page("Marked as not confirmed", "The member will not be let through."));
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
