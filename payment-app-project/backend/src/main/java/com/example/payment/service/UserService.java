package com.example.payment.service;

import com.example.payment.dto.CreateUserRequest;
import com.example.payment.dto.UserResponse;
import com.example.payment.exception.DuplicateUserException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.model.User;
import com.example.payment.repository.UserRepository;
import com.example.payment.util.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private static final String USER_SEQUENCE = "users";

    private final UserRepository userRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Value("${app.default-created-by}")
    private String defaultCreatedBy;

    public UserService(UserRepository userRepository, SequenceGeneratorService sequenceGeneratorService) {
        this.userRepository = userRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " was not found"));
        return toResponse(user);
    }

    public UserResponse searchByPhone(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(normalizePhone(phoneNumber))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No user found with phone number " + phoneNumber));
        return toResponse(user);
    }

    /**
     * Full registration flow: full name, email, phone number, address, and member/worker type
     * are all required. Rejects duplicate phone numbers and duplicate emails.
     */
    public UserResponse createUser(CreateUserRequest request) {
        String normalizedPhone = normalizePhone(request.getPhoneNumber());

        userRepository.findByPhoneNumber(normalizedPhone).ifPresent(existing -> {
            throw new DuplicateUserException(
                    "User with phone number " + request.getPhoneNumber() + " already exists");
        });
        userRepository.findByEmailIgnoreCase(request.getEmail()).ifPresent(existing -> {
            throw new DuplicateUserException(
                    "User with email " + request.getEmail() + " already exists");
        });

        User user = User.builder()
                .id(sequenceGeneratorService.nextValue(USER_SEQUENCE))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(normalizedPhone)
                .address(request.getAddress())
                .memberType(request.getMemberType())
                // TODO: once authentication is added, resolve createdBy from the SecurityContext
                // instead of this hardcoded default.
                .createdBy(defaultCreatedBy)
                .created(LocalDateTime.now())
                .build();

        return toResponse(userRepository.save(user));
    }

    /**
     * Finds an existing user by phone, or creates a lightweight record on the fly.
     * Used by PaymentService when recording a payment for a brand-new user who hasn't
     * gone through full registration yet.
     */
    User findOrCreateUser(String phoneNumber, String fullName) {
        String normalizedPhone = normalizePhone(phoneNumber);
        return userRepository.findByPhoneNumber(normalizedPhone)
                .orElseGet(() -> {
                    if (fullName == null || fullName.isBlank()) {
                        throw new IllegalArgumentException(
                                "No user exists with phone number " + phoneNumber
                                        + ". Provide 'fullName' to create a new user.");
                    }
                    User user = User.builder()
                            .id(sequenceGeneratorService.nextValue(USER_SEQUENCE))
                            .fullName(fullName)
                            .phoneNumber(normalizedPhone)
                            .createdBy(defaultCreatedBy)
                            .created(LocalDateTime.now())
                            .build();
                    return userRepository.save(user);
                });
    }

    private String normalizePhone(String phone) {
        return phone == null ? null : phone.replaceAll("[\\s\\-()]", "");
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .memberType(user.getMemberType())
                .createdBy(user.getCreatedBy())
                .created(user.getCreated())
                .build();
    }
}
