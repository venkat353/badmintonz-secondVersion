package com.badMinz.notification_service.controller;

import com.badMinz.notification_service.dto.EmailRequest;
import com.badMinz.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest request) {
        emailService.sendBookingConfirmation(request.getToEmail(), request.getBody());
        return "Email request received";
    }
}