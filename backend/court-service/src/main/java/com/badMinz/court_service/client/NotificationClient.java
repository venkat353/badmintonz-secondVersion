package com.badMinz.court_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.Data;

// 1. Name must match the Application Name of the other service (in uppercase usually)
@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {

    // 2. This must match the Controller endpoint in Notification Service
    @PostMapping("/api/notifications/send")
    String sendEmail(@RequestBody EmailRequest request);

    // 3. Inner DTO Class (just to hold data)
    @Data
    class EmailRequest {
        private String toEmail;
        private String subject;
        private String body;

        // Constructor for easy usage
        public EmailRequest(String toEmail, String subject, String body) {
            this.toEmail = toEmail;
            this.subject = subject;
            this.body = body;
        }
    }
}