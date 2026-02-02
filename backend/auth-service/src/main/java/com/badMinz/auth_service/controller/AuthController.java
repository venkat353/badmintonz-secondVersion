//package com.badMinz.auth_service.controller;
//
//import com.badMinz.auth_service.dto.RegisterRequest;
//import com.badMinz.auth_service.model.User;
//import com.badMinz.auth_service.service.AuthService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import com.badMinz.auth_service.dto.LoginRequest;
//import com.badMinz.auth_service.dto.AuthResponse;
//
//@RestController // 1. Tells Spring: "This is a REST API"
//@RequestMapping("/api/auth") // 2. Base URL
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthService authService;
//
//    @PostMapping("/register") // 3. Listens for POST requests
//    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
//        return ResponseEntity.ok(authService.register(request));
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
//        return ResponseEntity.ok(authService.login(request));
//    }
//
//    @GetMapping("/demo")
//    public ResponseEntity<String> sayHello() {
//        return ResponseEntity.ok("Hello from secured endpoint!");
//    }
//}




//=============================================    NEW ONE    ==============================================


package com.badMinz.auth_service.controller;

import com.badMinz.auth_service.dto.RegisterRequest;
import com.badMinz.auth_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.badMinz.auth_service.dto.LoginRequest;
import com.badMinz.auth_service.dto.AuthResponse;
import java.security.Principal;
import com.badMinz.auth_service.dto.UpdateProfileRequest;
import com.badMinz.auth_service.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Updated: Returns a String message instead of the User object to improve security
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/demo")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello from secured endpoint!");
    }

    // GET: /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        // 'Principal' automatically holds the logged-in user's email from the Token
        User user = authService.getUserProfile(principal.getName());
        return ResponseEntity.ok(user);
    }

    // PUT: /api/auth/me
    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(Principal principal, @RequestBody UpdateProfileRequest request) {
        User updatedUser = authService.updateUserProfile(principal.getName(), request);
        return ResponseEntity.ok(updatedUser);
    }
}