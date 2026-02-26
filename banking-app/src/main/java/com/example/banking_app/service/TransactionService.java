package com.example.banking_app.service;

import com.example.banking_app.model.Account;
import com.example.banking_app.model.Transaction;
import com.example.banking_app.repository.AccountRepository;
import com.example.banking_app.repository.TransactionRepository;
import com.example.banking_app.dto.TransactionRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public Transaction createTransaction(TransactionRequest request) {
        // Find the account
        Account account = accountRepository.findById(request.getAccountId())
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        // Create transaction
        Transaction transaction = Transaction.builder()
            .accountId(request.getAccountId())
            .type(request.getType())
            .amount(request.getAmount())
            .timestamp(LocalDateTime.now())
            .description(request.getDescription())
            .targetAccountId(request.getTargetAccountId())
            .build();
        
        // Update account balance based on transaction type
        switch(request.getType()) {
            case "DEPOSIT":
                account.setBalance(account.getBalance().add(request.getAmount()));
                break;
            case "WITHDRAWAL":
                if (account.getBalance().compareTo(request.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                account.setBalance(account.getBalance().subtract(request.getAmount()));
                break;
            case "TRANSFER":
                // Handle transfer logic
                break;
        }
        
        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }

    public Transaction getTransaction(String id) {
        return transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public java.util.List<Transaction> getAccountTransactions(String accountId) {
        return transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
    }
}