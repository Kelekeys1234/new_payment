package com.example.payment.service;

import com.example.payment.exception.EmailDeliveryException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Sends the payment-confirmation email via SMTP. Active when {@code app.mail.provider=smtp}.
 */
@Slf4j
@Service
@ConditionalOnProperty(prefix = "app.mail", name = "provider", havingValue = "smtp")
public class SmtpEmailService implements EmailService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy, h:mm a");

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public SmtpEmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    @Override
    public void sendPaymentConfirmationRequest(String toEmail, String payerName, BigDecimal amount, String currency,
                                                LocalDateTime submittedAt, String confirmUrl, String rejectUrl) {
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #8a7a1f;">Payment awaiting confirmation</h2>
                  <table style="width:100%%; border-collapse: collapse; margin: 16px 0;">
                    <tr><td style="padding:6px 0; color:#666;">Name</td><td style="padding:6px 0; font-weight:bold;">%s</td></tr>
                    <tr><td style="padding:6px 0; color:#666;">Amount</td><td style="padding:6px 0; font-weight:bold;">%s %s</td></tr>
                    <tr><td style="padding:6px 0; color:#666;">Submitted</td><td style="padding:6px 0; font-weight:bold;">%s</td></tr>
                  </table>
                  <p style="margin: 28px 0;">
                    <a href="%s" style="background:#2e7d32;color:#fff;padding:12px 24px;border-radius:6px;
                       text-decoration:none;font-weight:bold;margin-right:12px;">Confirm</a>
                    <a href="%s" style="background:#b71c1c;color:#fff;padding:12px 24px;border-radius:6px;
                       text-decoration:none;font-weight:bold;">Not confirm</a>
                  </p>
                  <p style="color:#666;font-size:13px;">If the buttons above don't work, copy this link:<br/>
                     Confirm: %s<br/>Not confirm: %s</p>
                </div>
                """.formatted(payerName, amount, currency, submittedAt.format(TIME_FORMAT),
                confirmUrl, rejectUrl, confirmUrl, rejectUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Payment confirmation needed - " + payerName + " (" + amount + " " + currency + ")");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailDeliveryException("Failed to send payment confirmation email to " + toEmail, e);
        }
    }
}
