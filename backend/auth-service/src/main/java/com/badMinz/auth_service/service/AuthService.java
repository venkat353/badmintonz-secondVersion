//package com.badMinz.auth_service.service;
//
//import com.badMinz.auth_service.dto.RegisterRequest;
//import com.badMinz.auth_service.model.User;
//import com.badMinz.auth_service.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import com.badMinz.auth_service.dto.LoginRequest;
//import com.badMinz.auth_service.dto.AuthResponse;
//
//@Service // 1. Tells Spring: "This holds business logic"
//@RequiredArgsConstructor // 2. Lombok: Creates constructor for dependency injection
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtService jwtService;
//
//    public User register(RegisterRequest request) {
//        // Check if user exists
//        if (userRepository.existsByEmail(request.email())) {
//            throw new RuntimeException("Email already in use");
//        }
//
//        // Map DTO to Entity
//        // Note: We are NOT hashing the password yet (Next lesson!)
//        User user = User.builder()
//                .name(request.name())
//                .email(request.email())
//                .password(passwordEncoder.encode(request.password())) // DANGER: Storing plain text for now
//                .role(com.badMinz.auth_service.model.Role.USER) // Default role
//                .build();
//
//        return userRepository.save(user);
//    }
//
//    public AuthResponse login(LoginRequest request) {
//        // 1. Find the user
//        User user = userRepository.findByEmail(request.email())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // 2. Check Password
//        // passwordEncoder.matches(rawPassword, hashedPassword)
//        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        // 3. Generate Token
//        String token = jwtService.generateToken(user.getEmail());
//
//        return new AuthResponse(token);
//    }
//}


//========================================   NEW ONE   ========================================================


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
@Slf4j // 1. Adds Logging capability
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 2. Changed return type from User to void for security
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
                .password(passwordEncoder.encode(request.password())) // Password is securely hashed
                .role(com.badMinz.auth_service.model.Role.USER) // Default role
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", request.email());
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Find the user
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("Login failed: User {} not found", request.email());
                    return new RuntimeException("User not found");
                });

        // 2. Check Password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Login failed: Invalid password for user {}", request.email());
            throw new RuntimeException("Invalid password");
        }

        // 3. Generate Token
        String token = jwtService.generateToken(user.getEmail());
        log.info("User logged in successfully: {}", request.email());

        return new AuthResponse(token);
    }
}