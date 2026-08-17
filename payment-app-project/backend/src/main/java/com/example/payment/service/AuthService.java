package com.example.payment.service;

import com.example.payment.dto.ActivateAccountRequest;
import com.example.payment.dto.AuthResponse;
import com.example.payment.dto.AuthStatusResponse;
import com.example.payment.dto.AuthUserResponse;
import com.example.payment.dto.LoginRequest;
import com.example.payment.dto.MessageResponse;
import com.example.payment.exception.AccountAlreadyActivatedException;
import com.example.payment.exception.InvalidCredentialsException;
import com.example.payment.exception.InvalidOtpException;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.model.User;
import com.example.payment.repository.UserRepository;
import com.example.payment.security.CurrentUser;
import com.example.payment.security.JwtService;
import com.example.payment.util.PhoneUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Duration OTP_VALIDITY = Duration.ofMinutes(5);
    private static final Duration OTP_RESEND_COOLDOWN = Duration.ofSeconds(60);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SmsService smsService;
    private final String superAdminPhone;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                        SmsService smsService, @Value("${app.security.super-admin-phone}") String superAdminPhone) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.smsService = smsService;
        this.superAdminPhone = superAdminPhone;
    }

    public AuthStatusResponse status(String phoneNumber) {
        String normalized = PhoneUtils.normalize(phoneNumber);
        return userRepository.findByPhoneNumber(normalized)
                .map(user -> AuthStatusResponse.builder()
                        .registered(true)
                        .activated(user.getPasswordHash() != null)
                        .build())
                .orElse(AuthStatusResponse.builder().registered(false).activated(false).build());
    }

    public MessageResponse requestOtp(String phoneNumber) {
        User user = findUserOrThrow(phoneNumber);
        if (user.getPasswordHash() != null) {
            throw new AccountAlreadyActivatedException(
                    "This account already has a password set. Please log in instead.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (user.getOtpRequestedAt() != null
                && Duration.between(user.getOtpRequestedAt(), now).compareTo(OTP_RESEND_COOLDOWN) < 0) {
            throw new IllegalArgumentException("Please wait a moment before requesting another code.");
        }

        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));
        user.setOtpCode(otp);
        user.setOtpExpiresAt(now.plus(OTP_VALIDITY));
        user.setOtpRequestedAt(now);
        userRepository.save(user);

        smsService.sendOtp(user.getPhoneNumber(), otp);
        return MessageResponse.builder().message("A verification code has been sent to your phone.").build();
    }

    public AuthResponse activateAccount(ActivateAccountRequest request) {
        User user = findUserOrThrow(request.getPhoneNumber());
        if (user.getPasswordHash() != null) {
            throw new AccountAlreadyActivatedException(
                    "This account already has a password set. Please log in instead.");
        }
        if (user.getOtpCode() == null || user.getOtpExpiresAt() == null
                || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("This code has expired. Please request a new one.");
        }
        if (!user.getOtpCode().equals(request.getOtp())) {
            throw new InvalidOtpException("Incorrect code. Please try again.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        user.setOtpRequestedAt(null);
        userRepository.save(user);

        return issueToken(user);
    }

    public AuthResponse login(LoginRequest request) {
        String normalized = PhoneUtils.normalize(request.getPhoneNumber());
        User user = userRepository.findByPhoneNumber(normalized).orElse(null);
        if (user == null || user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid phone number or password.");
        }
        return issueToken(user);
    }

    public AuthUserResponse me(CurrentUser currentUser) {
        User user = userRepository.findById(currentUser.id())
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + currentUser.id() + " was not found"));
        return toAuthUserResponse(user);
    }

    public AuthUserResponse grantAdmin(String phoneNumber) {
        User user = findUserOrThrow(phoneNumber);
        user.setAdmin(true);
        userRepository.save(user);
        return toAuthUserResponse(user);
    }

    private User findUserOrThrow(String phoneNumber) {
        String normalized = PhoneUtils.normalize(phoneNumber);
        return userRepository.findByPhoneNumber(normalized)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No user found with phone number " + phoneNumber + ". Please register first."));
    }

    private AuthResponse issueToken(User user) {
        String token = jwtService.generateToken(user.getId(), user.getPhoneNumber());
        return AuthResponse.builder()
                .token(token)
                .user(toAuthUserResponse(user))
                .build();
    }

    private AuthUserResponse toAuthUserResponse(User user) {
        boolean superAdmin = superAdminPhone.equals(user.getPhoneNumber());
        boolean admin = superAdmin || Boolean.TRUE.equals(user.getAdmin());
        return AuthUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .memberType(user.getMemberType())
                .admin(admin)
                .superAdmin(superAdmin)
                .build();
    }
}
