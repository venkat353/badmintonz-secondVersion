package com.badMinz.court_service.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class SlotGenerationRequest {
    private Long courtId;
    private LocalDate startDate; // e.g., 2026-02-01
    private LocalDate endDate;   // e.g., 2026-02-07
    private int startHour;       // e.g., 9 (for 9:00 AM)
    private int endHour;         // e.g., 21 (for 9:00 PM)
}