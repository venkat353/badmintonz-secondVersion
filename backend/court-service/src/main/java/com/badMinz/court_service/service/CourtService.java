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
import com.badMinz.court_service.dto.SlotGenerationRequest;

import com.badMinz.court_service.client.NotificationClient;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    private final NotificationClient notificationClient;

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
        try {
            String subject = "Booking Confirmed! 🏸";
            String body = "You have successfully booked " + timeslot.getCourt().getName() +
                    " on " + timeslot.getStartTime().toLocalDate() +
                    " at " + timeslot.getStartTime().toLocalTime();

            // Call the other microservice
            notificationClient.sendEmail(new NotificationClient.EmailRequest(userEmail, subject, body));

        } catch (Exception e) {
            // IMPORTANT: If email fails, do NOT fail the booking. Just log it.
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return timeslotRepository.save(timeslot);
    }
    public List<Timeslot> getUserBookings(String email) {
        return timeslotRepository.findByReservedBy(email);
    }

    public void generateWeeklySlots(SlotGenerationRequest request) {
        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found"));

        // Loop through each DAY (Start Date -> End Date)
        LocalDate currentDate = request.getStartDate();
        while (!currentDate.isAfter(request.getEndDate())) {

            // Loop through each HOUR (Start Hour -> End Hour)
            for (int hour = request.getStartHour(); hour < request.getEndHour(); hour++) {

                LocalDateTime start = currentDate.atTime(hour, 0);
                LocalDateTime end = currentDate.atTime(hour + 1, 0); // 1 Hour slots

                // Only create if it doesn't exist yet
                if (!timeslotRepository.existsByCourtAndStartTime(court, start)) {
                    Timeslot slot = Timeslot.builder()
                            .court(court)
                            .startTime(start)
                            .endTime(end)
                            .isBooked(false)
                            .build();
                    timeslotRepository.save(slot);
                }
            }
            // Move to next day
            currentDate = currentDate.plusDays(1);
        }
    }

    // ... existing imports ...

    public void cancelBooking(Long timeslotId, String userEmail) {
        // 1. Find the slot
        Timeslot slot = timeslotRepository.findById(timeslotId)
                .orElseThrow(() -> new RuntimeException("Timeslot not found"));

        // 2. Security Check: specific user can only cancel THEIR OWN booking
        if (!userEmail.equals(slot.getReservedBy())) {
            throw new RuntimeException("You are not authorized to cancel this booking.");
        }

        // 3. Reset the slot
        slot.setBooked(false);
        slot.setReservedBy(null);

        // 4. Save
        timeslotRepository.save(slot);
    }
}