package com.badMinz.court_service.repository;
import com.badMinz.court_service.model.Court;
import com.badMinz.court_service.model.Timeslot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TimeslotRepository extends JpaRepository<Timeslot, Long> {

    // Find slots for a specific court
    List<Timeslot> findByCourtId(Long courtId);
    List<Timeslot> findByCourtIdAndStartTimeBeforeAndEndTimeAfter(
            Long courtId, LocalDateTime endTime, LocalDateTime startTime);
    // ... existing imports

    // Find slots within a specific date range (e.g., Jan 12th 00:00 to Jan 12th 23:59)
    List<Timeslot> findByCourtIdAndStartTimeBetween(Long courtId, LocalDateTime start, LocalDateTime end);
    // NEW: Find all slots booked by a specific email
    List<Timeslot> findByReservedBy(String email);
    boolean existsByCourtAndStartTime(Court court, LocalDateTime startTime);
}