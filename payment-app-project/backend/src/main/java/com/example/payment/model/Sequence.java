package com.example.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Backs auto-incrementing IDs (Mongo has no native auto-increment).
 * One document per sequence name, e.g. "users" or "payments".
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sequences")
public class Sequence {
    @Id
    private String id; // sequence name, e.g. "users", "payments"
    private long value;
}
