package com.example.payment.service;

import com.example.payment.dto.GivingIntentResponse;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.model.GivingIntent;
import com.example.payment.model.GivingIntentStatus;
import com.example.payment.repository.GivingIntentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Backs the "I have paid" step on the giving page: creates a pending confirmation
 * request, emails the admin a confirm/reject link, and reports status back to the
 * frontend so it can poll and auto-advance once the admin confirms by email.
 */
@Service
@RequiredArgsConstructor
public class GivingIntentService {

    private final GivingIntentRepository repository;
    private final EmailService emailService;

    @Value("${app.public-base-url}")
    private String publicBaseUrl;

    @Value("${app.giving.admin-email}")
    private String adminEmail;

    public GivingIntentResponse create() {
        GivingIntent intent = GivingIntent.builder()
                .id(UUID.randomUUID().toString())
                .status(GivingIntentStatus.PENDING)
                .created(LocalDateTime.now())
                .build();
        repository.save(intent);

        String confirmUrl = publicBaseUrl + "/api/giving-intents/" + intent.getId() + "/confirm";
        String rejectUrl = publicBaseUrl + "/api/giving-intents/" + intent.getId() + "/reject";
        emailService.sendGivingConfirmationRequest(adminEmail, confirmUrl, rejectUrl);

        return toResponse(intent);
    }

    public GivingIntentResponse getStatus(String token) {
        return toResponse(find(token));
    }

    public GivingIntentResponse confirm(String token) {
        GivingIntent intent = find(token);
        if (intent.getStatus() == GivingIntentStatus.PENDING) {
            intent.setStatus(GivingIntentStatus.CONFIRMED);
            intent.setRespondedAt(LocalDateTime.now());
            repository.save(intent);
        }
        return toResponse(intent);
    }

    public GivingIntentResponse reject(String token) {
        GivingIntent intent = find(token);
        if (intent.getStatus() == GivingIntentStatus.PENDING) {
            intent.setStatus(GivingIntentStatus.NOT_CONFIRMED);
            intent.setRespondedAt(LocalDateTime.now());
            repository.save(intent);
        }
        return toResponse(intent);
    }

    private GivingIntent find(String token) {
        return repository.findById(token)
                .orElseThrow(() -> new ResourceNotFoundException("Giving intent not found: " + token));
    }

    private GivingIntentResponse toResponse(GivingIntent intent) {
        return GivingIntentResponse.builder()
                .token(intent.getId())
                .status(intent.getStatus())
                .build();
    }
}
