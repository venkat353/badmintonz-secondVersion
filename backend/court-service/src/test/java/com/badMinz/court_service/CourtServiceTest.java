package com.badMinz.court_service;

import com.badMinz.court_service.model.Court;
import com.badMinz.court_service.model.SurfaceType;
import com.badMinz.court_service.model.Timeslot;
import com.badMinz.court_service.repository.CourtRepository;
import com.badMinz.court_service.repository.TimeslotRepository;
import com.badMinz.court_service.service.CourtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Enables Mockito
class CourtServiceTest {

    @Mock
    private CourtRepository courtRepository; // Mock the DB layer

    @Mock
    private TimeslotRepository timeslotRepository;

    @InjectMocks
    private CourtService courtService; // Inject mocks into the real service

    private Court sampleCourt;
    private Timeslot sampleTimeslot;

    @BeforeEach
    void setUp() {
        // Prepare data for testing
        sampleCourt = Court.builder()
                .id(1L)
                .name("Test Court")
                .surfaceType(SurfaceType.WOODEN)
                .pricePerHour(new BigDecimal("500.00"))
                .isActive(true)
                .build();

        sampleTimeslot = Timeslot.builder()
                .id(100L)
                .court(sampleCourt)
                .startTime(LocalDateTime.now().plusHours(1))
                .endTime(LocalDateTime.now().plusHours(2))
                .isBooked(false)
                .build();
    }

    @Test
    void testCreateCourt_Success() {
        // Arrange: Tell Mockito what to return when repository is called
        when(courtRepository.save(any(Court.class))).thenReturn(sampleCourt);

        // Act: Call the real service method
        Court result = courtService.createCourt(sampleCourt);

        // Assert: Verify the result is what we expect
        assertNotNull(result);
        assertEquals("Test Court", result.getName());
        verify(courtRepository, times(1)).save(any(Court.class)); // Ensure DB was called once
    }

    @Test
    void testBookTimeslot_Success() {
        // Arrange
        String userEmail = "test@user.com";
        when(timeslotRepository.findById(100L)).thenReturn(Optional.of(sampleTimeslot));
        when(timeslotRepository.save(any(Timeslot.class))).thenReturn(sampleTimeslot);

        // Act
        Timeslot result = courtService.bookTimeslot(100L, userEmail);

        // Assert
        assertTrue(result.isBooked()); // Should now be booked
        assertEquals(userEmail, result.getReservedBy()); // Should have user's email
        verify(timeslotRepository, times(1)).save(sampleTimeslot); // Ensure update was saved
    }

    @Test
    void testBookTimeslot_AlreadyBooked_ThrowsException() {
        // Arrange
        sampleTimeslot.setBooked(true); // Simulate slot is already taken
        when(timeslotRepository.findById(100L)).thenReturn(Optional.of(sampleTimeslot));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            courtService.bookTimeslot(100L, "another@user.com");
        });

        assertEquals("This slot is already booked!", exception.getMessage());
        verify(timeslotRepository, never()).save(any(Timeslot.class)); // Should NEVER save
    }
}