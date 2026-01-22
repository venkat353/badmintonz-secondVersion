package com.badMinz.court_service.controller;

import com.badMinz.court_service.model.Court;
import com.badMinz.court_service.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.badMinz.court_service.model.Timeslot;
import com.badMinz.court_service.dto.TimeslotRequest;

import java.time.LocalDate;
import java.security.Principal;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class CourtController {

    private final CourtService courtService;

    // POST /api/courts (Create a court)
    @PostMapping
    public ResponseEntity<Court> createCourt(@RequestBody Court court) {
        return ResponseEntity.ok(courtService.createCourt(court));
    }

    // GET /api/courts (List all active courts)
    @GetMapping
    public ResponseEntity<List<Court>> getAllCourts() {
        return ResponseEntity.ok(courtService.getAllCourts());
    }

    // GET /api/courts/{id} (Get single court)
    @GetMapping("/{id}")
    public ResponseEntity<Court> getCourt(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtById(id));
    }

    @PostMapping("/timeslots")
    public ResponseEntity<Timeslot> createTimeslot(@RequestBody TimeslotRequest request) {
        return ResponseEntity.ok(courtService.createTimeslot(request));
    }

    @GetMapping("/{courtId}/timeslots")
    public ResponseEntity<List<Timeslot>> getTimeslots(
            @PathVariable Long courtId,
            @RequestParam LocalDate date // Spring automatically converts String "2026-02-01" to LocalDate!
    ) {
        return ResponseEntity.ok(courtService.getTimeslotsByDate(courtId, date));
    }

    @PostMapping("/timeslots/{id}/book")
    public ResponseEntity<Timeslot> bookTimeslot(
            @PathVariable Long id,
            Principal principal // <--- Spring Security injects the logged-in user here
    ) {
        // Principal.getName() returns the email because we set it in the JWT Filter
        return ResponseEntity.ok(courtService.bookTimeslot(id, principal.getName()));
    }
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Timeslot>> getMyBookings(Principal principal) {
        // principal.getName() is the email from the Token
        return ResponseEntity.ok(courtService.getUserBookings(principal.getName()));
    }
}