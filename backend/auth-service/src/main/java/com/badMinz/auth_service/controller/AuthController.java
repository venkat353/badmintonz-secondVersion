package com.badMinz.auth_service.controller;

import com.badMinz.auth_service.dto.RegisterRequest;
import com.badMinz.auth_service.model.User;
import com.badMinz.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.badMinz.auth_service.dto.LoginRequest;
import com.badMinz.auth_service.dto.AuthResponse;

@RestController // 1. Tells Spring: "This is a REST API"
@RequestMapping("/api/auth") // 2. Base URL
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register") // 3. Listens for POST requests
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/demo")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint!");
    }
}