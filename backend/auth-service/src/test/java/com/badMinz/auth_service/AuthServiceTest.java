package com.badMinz.auth_service;

import com.badMinz.auth_service.dto.RegisterRequest;
import com.badMinz.auth_service.model.User;
import com.badMinz.auth_service.repository.UserRepository;
import com.badMinz.auth_service.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class) // 1. Tells JUnit to enable Mockito
class AuthServiceTest {

    @Mock // 2. Create a "Fake" Repository
    private UserRepository userRepository;

    @Mock // 2. Create a "Fake" Password Encoder
    private PasswordEncoder passwordEncoder;

    @InjectMocks // 3. Inject the fakes into the real Service
    private AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        // Setup data before every test
        validRequest = new RegisterRequest("Test User", "test@example.com", "password123");
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // A. Arrange (Prepare the scenario)
        // When the service asks "does this email exist?", say "false"
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
        // When encoding password, just return "encodedPass"
        when(passwordEncoder.encode(validRequest.password())).thenReturn("encodedPass");

        // B. Act (Run the method)
        authService.register(validRequest);

        // C. Assert (Check the result)
        // Verify that userRepository.save() was called exactly once
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowErrorIfEmailExists() {
        // A. Arrange
        // When checking email, say "true" (it already exists)
        when(userRepository.existsByEmail(validRequest.email())).thenReturn(true);

        // B. Act & Assert
        // Expect an Exception when we call register()
        assertThrows(RuntimeException.class, () -> {
            authService.register(validRequest);
        });

        // Verify we NEVER tried to save a user
        verify(userRepository, never()).save(any(User.class));
    }
}