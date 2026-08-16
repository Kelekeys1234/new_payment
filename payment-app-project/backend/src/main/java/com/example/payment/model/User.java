package com.example.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * A registered user (member or worker), stored in the "users" MongoDB collection.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private Long id;

    private String fullName;

    @Indexed(unique = true, sparse = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String phoneNumber;

    private String address;

    private MemberType memberType;

    private String createdBy;

    private LocalDateTime created;
}
