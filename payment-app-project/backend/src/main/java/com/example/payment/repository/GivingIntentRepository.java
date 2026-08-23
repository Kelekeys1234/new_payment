package com.example.payment.repository;

import com.example.payment.model.GivingIntent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GivingIntentRepository extends MongoRepository<GivingIntent, String> {
}
