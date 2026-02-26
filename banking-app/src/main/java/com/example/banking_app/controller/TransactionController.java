package com.example.banking_app.controller;

import com.example.banking_app.dto.TransactionRequest;
import com.example.banking_app.model.User;
import com.example.banking_app.service.TransactionService;
import com.example.banking_app.repository.UserRepository;
import com.example.banking_app.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify the account belongs to the user
        var account = accountRepository.findById(request.getAccountId())
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUserId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Account does not belong to user");
        }
        
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAccountTransactions(@PathVariable String accountId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify the account belongs to the user
        var account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUserId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Account does not belong to user");
        }
        
        return ResponseEntity.ok(transactionService.getAccountTransactions(accountId));
    }
}