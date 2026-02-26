package com.example.banking_app.controller;

import com.example.banking_app.dto.LoginRequest;
import com.example.banking_app.dto.RegisterRequest;
import com.example.banking_app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Map<String, Object> response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Commenté car la méthode registerAdmin n'existe pas dans AuthService
    /*
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        try {
            RegisterRequest request = new RegisterRequest();
            request.setName("Admin");
            request.setEmail("admin@banking.com");
            request.setPassword("admin123");
            
            Map<String, Object> response = authService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    */
}