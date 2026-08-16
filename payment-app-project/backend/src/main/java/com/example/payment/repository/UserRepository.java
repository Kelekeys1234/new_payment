package com.example.payment.repository;

import com.example.payment.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Long> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByEmailIgnoreCase(String email);
}
