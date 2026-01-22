package com.badMinz.court_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "timeslots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Timeslot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime startTime; // e.g., 2026-01-10T10:00:00

    @Column(nullable = false)
    private LocalDateTime endTime;   // e.g., 2026-01-10T11:00:00

    @Builder.Default
    private boolean isBooked = false; // Initially available

    // RELATIONSHIP
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "court_id", nullable = false)
//    @JsonIgnore // Prevent infinite recursion in JSON (Court -> Timeslots -> Court...)
    private Court court;

    @Column(name = "reserved_by")
    private String reservedBy; // The email of the user who booked it
}