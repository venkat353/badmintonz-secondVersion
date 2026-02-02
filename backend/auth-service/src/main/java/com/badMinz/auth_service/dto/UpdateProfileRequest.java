package com.badMinz.auth_service.dto;

public record UpdateProfileRequest(
        String name,
        String phoneNumber,
        String city,
        String skillLevel,
        String playingHand,
        String bio
) {}