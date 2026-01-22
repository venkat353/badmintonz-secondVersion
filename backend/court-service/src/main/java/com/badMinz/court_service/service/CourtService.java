package com.badMinz.court_service.service;

import com.badMinz.court_service.model.Court;
import com.badMinz.court_service.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.badMinz.court_service.model.Timeslot;
import com.badMinz.court_service.repository.TimeslotRepository;
import com.badMinz.court_service.dto.TimeslotRequest;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;

    public Court createCourt(Court court) {
        // Business Rule: New courts are active by default
        court.setIsActive(true);
        return courtRepository.save(court);
    }

    public List<Court> getAllCourts() {
        // Business Rule: Don't show deleted courts
        return courtRepository.findByIsActiveTrue();
    }

    public Court getCourtById(Long id) {
        return courtRepository.findById(id)
                .filter(Court::getIsActive) // If found but inactive, treat as empty
                .orElseThrow(() -> new RuntimeException("Court not found"));
    }

    private final TimeslotRepository timeslotRepository; // Add this! (Lombok will inject it)

    public Timeslot createTimeslot(TimeslotRequest request) {
        // 1. Check if Court exists
        Court court = getCourtById(request.courtId());

        // 2. Check for Overlaps
        // "Is there any slot that starts BEFORE my end time AND ends AFTER my start time?"
        List<Timeslot> existingOverlaps = timeslotRepository
                .findByCourtIdAndStartTimeBeforeAndEndTimeAfter(
                        request.courtId(), request.endTime(), request.startTime());

        if (!existingOverlaps.isEmpty()) {
            throw new RuntimeException("Timeslot overlaps with an existing one!");
        }

        // 3. Save
        Timeslot timeslot = Timeslot.builder()
                .court(court)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .isBooked(false)
                .build();

        return timeslotRepository.save(timeslot);
    }

    public List<Timeslot> getTimeslotsByDate(Long courtId, LocalDate date) {
        // Calculate 00:00:00 to 23:59:59 for the requested date
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        return timeslotRepository.findByCourtIdAndStartTimeBetween(courtId, startOfDay, endOfDay);
    }

    public Timeslot bookTimeslot(Long timeslotId, String userEmail) {
        Timeslot timeslot = timeslotRepository.findById(timeslotId)
                .orElseThrow(() -> new RuntimeException("Timeslot not found"));

        if (timeslot.isBooked()) {
            throw new RuntimeException("This slot is already booked!");
        }

        timeslot.setBooked(true);
        timeslot.setReservedBy(userEmail);

        return timeslotRepository.save(timeslot);
    }
    public List<Timeslot> getUserBookings(String email) {
        return timeslotRepository.findByReservedBy(email);
    }
}