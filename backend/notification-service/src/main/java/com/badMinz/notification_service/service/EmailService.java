package com.badMinz.notification_service.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String messageBody) {
        try {
            log.info("📧 Attempting to send real email to: {}", toEmail);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("YOUR_REAL_EMAIL@gmail.com"); // This is just a label, Gmail overrides it with authenticated user
            message.setTo(toEmail);
            message.setSubject("BadMintoz Booking Confirmation 🏸");
            message.setText(messageBody + "\n\nSee you on the court!\n- The BadMintoz Team");

            mailSender.send(message);

            log.info("✅ Email Sent Successfully!");
        } catch (Exception e) {
            log.error("❌ Failed to send email", e);
        }
    }
}