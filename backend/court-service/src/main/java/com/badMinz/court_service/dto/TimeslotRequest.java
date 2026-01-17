package com.badMinz.court_service.dto;

import java.time.LocalDateTime;

public record TimeslotRequest(
        Long courtId,
        LocalDateTime startTime, // "2026-01-12T10:00:00"
        LocalDateTime endTime    // "2026-01-12T11:00:00"
) {}