package com.example.payment.repository;

import com.example.payment.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(Long userId);

    Optional<Payment> findByConfirmationToken(String confirmationToken);
}
