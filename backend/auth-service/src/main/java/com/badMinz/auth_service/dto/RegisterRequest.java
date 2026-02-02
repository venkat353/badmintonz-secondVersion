package com.badMinz.auth_service.dto;

// 🆕 Updated Record to include Profile Fields
public record RegisterRequest(
        String name,
        String email,
        String password,
        String phoneNumber,  // New
        String city,         // New
        String skillLevel,   // New
        String playingHand,  // New
        String bio           // New
) {
}