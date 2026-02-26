package com.example.banking_app.controller;

import com.example.banking_app.model.User;
import com.example.banking_app.service.AccountService;
import com.example.banking_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final UserRepository userRepository;

    @GetMapping("/my-accounts")
    public ResponseEntity<?> getMyAccounts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(accountService.getAccountsByUserId(user.getId()));
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getTotalBalance() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalBalance", accountService.getTotalBalance(user.getId()));
        response.put("accounts", accountService.getAccountsByUserId(user.getId()));
        
        return ResponseEntity.ok(response);
    }
}