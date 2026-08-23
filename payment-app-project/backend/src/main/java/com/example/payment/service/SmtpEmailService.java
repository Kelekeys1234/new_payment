package com.example.payment.service;

import com.example.payment.exception.EmailDeliveryException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Sends the giving-confirmation email via SMTP. Active when {@code app.mail.provider=smtp}.
 */
@Slf4j
@Service
@ConditionalOnProperty(prefix = "app.mail", name = "provider", havingValue = "smtp")
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public SmtpEmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    @Override
    public void sendGivingConfirmationRequest(String toEmail, String confirmUrl, String rejectUrl) {
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #8a7a1f;">Giving confirmation needed</h2>
                  <p>A member on the Nehemiah Builders payment wallet has indicated they've completed
                     a payment and is waiting to be let through to the payment details form.</p>
                  <p style="margin: 28px 0;">
                    <a href="%s" style="background:#2e7d32;color:#fff;padding:12px 24px;border-radius:6px;
                       text-decoration:none;font-weight:bold;margin-right:12px;">Confirm</a>
                    <a href="%s" style="background:#b71c1c;color:#fff;padding:12px 24px;border-radius:6px;
                       text-decoration:none;font-weight:bold;">Not confirm</a>
                  </p>
                  <p style="color:#666;font-size:13px;">If the buttons above don't work, copy this link:<br/>
                     Confirm: %s<br/>Not confirm: %s</p>
                </div>
                """.formatted(confirmUrl, rejectUrl, confirmUrl, rejectUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Giving confirmation needed - Nehemiah Builders");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailDeliveryException("Failed to send giving confirmation email to " + toEmail, e);
        }
    }
}
