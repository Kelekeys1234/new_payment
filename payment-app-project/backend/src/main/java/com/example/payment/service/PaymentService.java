package com.example.payment.service;

import com.example.payment.dto.CreatePaymentRequest;
import com.example.payment.dto.PaymentResponse;
import com.example.payment.dto.UserPaymentSummary;
import com.example.payment.dto.UserResponse;
import com.example.payment.exception.ResourceNotFoundException;
import com.example.payment.model.Payment;
import com.example.payment.model.PaymentPurpose;
import com.example.payment.model.User;
import com.example.payment.repository.PaymentRepository;
import com.example.payment.repository.UserRepository;
import com.example.payment.util.SequenceGeneratorService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final String PAYMENT_SEQUENCE = "payments";
    private static final String PAYMENT_ID_PREFIX = "PAY-";
    private static final int PAYMENT_ID_PAD_LENGTH = 6;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final SequenceGeneratorService sequenceGeneratorService;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository,
                           UserService userService, SequenceGeneratorService sequenceGeneratorService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public List<PaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        Map<Long, User> usersById = indexUsers();
        return payments.stream()
                .map(p -> toResponse(p, usersById.get(p.getUserId())))
                .toList();
    }

    public PaymentResponse getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment with id " + id + " was not found"));
        User user = userRepository.findById(payment.getUserId()).orElse(null);
        return toResponse(payment, user);
    }

    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        // Ensure the user exists so callers get a clean 404 rather than an empty list for typos.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " was not found"));
        return paymentRepository.findByUserId(userId).stream()
                .map(p -> toResponse(p, user))
                .toList();
    }

    /**
     * Free-text search across payment id, user name, and phone number.
     */
    public List<PaymentResponse> search(String query) {
        if (query == null || query.isBlank()) {
            return getAllPayments();
        }
        String normalized = query.trim().toLowerCase();
        Map<Long, User> usersById = indexUsers();

        return paymentRepository.findAll().stream()
                .filter(p -> {
                    User user = usersById.get(p.getUserId());
                    boolean matchesId = p.getId() != null && p.getId().toLowerCase().contains(normalized);
                    boolean matchesName = user != null && user.getFullName() != null
                            && user.getFullName().toLowerCase().contains(normalized);
                    boolean matchesPhone = user != null && user.getPhoneNumber() != null
                            && user.getPhoneNumber().toLowerCase().contains(normalized);
                    return matchesId || matchesName || matchesPhone;
                })
                .map(p -> toResponse(p, usersById.get(p.getUserId())))
                .toList();
    }

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        User user = userService.findOrCreateUser(request.getPhoneNumber(), request.getFullName(), request.getCreatedBy());

        Payment payment = Payment.builder()
                .id(generateNextPaymentId())
                .userId(user.getId())
                .visitor(Boolean.TRUE.equals(request.getIsVisitor()))
                .paymentType(request.getPaymentType())
                .paymentPurpose(request.getPaymentPurpose())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .createdBy(request.getCreatedBy())
                .created(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);
        return toResponse(saved, user);
    }

    public UserPaymentSummary getUserSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " was not found"));

        List<Payment> payments = paymentRepository.findByUserId(userId);

        BigDecimal totalLoans = sumByPurpose(payments, PaymentPurpose.LOAN);
        BigDecimal totalDonations = sumByPurpose(payments, PaymentPurpose.DONATION);
        BigDecimal totalAmount = totalLoans.add(totalDonations);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .memberType(user.getMemberType())
                .createdBy(user.getCreatedBy())
                .created(user.getCreated())
                .build();

        List<PaymentResponse> paymentResponses = payments.stream()
                .map(p -> toResponse(p, user))
                .toList();

        return UserPaymentSummary.builder()
                .user(userResponse)
                .totalPayments(payments.size())
                .totalLoans(totalLoans)
                .totalDonations(totalDonations)
                .totalAmount(totalAmount)
                .payments(paymentResponses)
                .build();
    }

    private String generateNextPaymentId() {
        long next = sequenceGeneratorService.nextValue(PAYMENT_SEQUENCE);
        return PAYMENT_ID_PREFIX + String.format("%0" + PAYMENT_ID_PAD_LENGTH + "d", next);
    }

    // NOTE: this summary intentionally does not attempt to convert across currencies -
    // totals are simple sums. For multi-currency users, consider breaking totals down
    // per-currency in a future iteration.
    private BigDecimal sumByPurpose(List<Payment> payments, PaymentPurpose purpose) {
        return payments.stream()
                .filter(p -> p.getPaymentPurpose() == purpose)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<Long, User> indexUsers() {
        return userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, Function.identity(), (a, b) -> a));
    }

    private PaymentResponse toResponse(Payment payment, User user) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .userName(user != null ? user.getFullName() : null)
                .phoneNumber(user != null ? user.getPhoneNumber() : null)
                .isVisitor(payment.isVisitor())
                .paymentType(payment.getPaymentType())
                .paymentPurpose(payment.getPaymentPurpose())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .createdBy(payment.getCreatedBy())
                .created(payment.getCreated())
                .build();
    }
}
