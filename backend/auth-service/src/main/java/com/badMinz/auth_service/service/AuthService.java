package com.badMinz.auth_service.service;

import com.badMinz.auth_service.dto.RegisterRequest;
import com.badMinz.auth_service.model.User;
import com.badMinz.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.badMinz.auth_service.dto.LoginRequest;
import com.badMinz.auth_service.dto.AuthResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        // Check if user exists
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration failed: Email {} already in use", request.email());
            throw new RuntimeException("Email already in use");
        }

        // Map DTO to Entity
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(com.badMinz.auth_service.model.Role.USER)

                // 🆕 MAPPING NEW FIELDS HERE
                .phoneNumber(request.phoneNumber())
                .city(request.city())
                // If skill level is null, default to "Beginner"
                .skillLevel(request.skillLevel() != null ? request.skillLevel() : "Beginner")
                .playingHand(request.playingHand())
                .bio(request.bio())
                // ---------------------------

                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", request.email());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("Login failed: User {} not found", request.email());
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Login failed: Invalid password for user {}", request.email());
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        log.info("User logged in successfully: {}", request.email());

        return new AuthResponse(token);
    }

    // 1. Fetch Profile
    public User getUserProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 2. Update Profile
    public User updateUserProfile(String email, com.badMinz.auth_service.dto.UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only update fields if they are not null (partial update)
        if (request.name() != null) user.setName(request.name());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());
        if (request.city() != null) user.setCity(request.city());
        if (request.skillLevel() != null) user.setSkillLevel(request.skillLevel());
        if (request.playingHand() != null) user.setPlayingHand(request.playingHand());
        if (request.bio() != null) user.setBio(request.bio());

        return userRepository.save(user);
    }
}