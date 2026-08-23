package com.example.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Tracks a "I have paid" click on the giving page while an admin confirms it by email.
 * The id doubles as the unguessable token used in the confirm/reject email links.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "giving_intents")
public class GivingIntent {

    @Id
    private String id;

    private GivingIntentStatus status;
    private LocalDateTime created;
    private LocalDateTime respondedAt;
}
