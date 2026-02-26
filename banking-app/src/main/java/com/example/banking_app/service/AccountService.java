package com.example.banking_app.service;

import com.example.banking_app.model.Account;
import com.example.banking_app.model.enums.AccountStatus;
import com.example.banking_app.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    private final AccountRepository accountRepository;

    public Account getAccount(String id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public List<Account> getAccountsByUserId(String userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account createAccount(String userId) {
        Account account = Account.builder()
            .userId(userId)
            .accountNumber(generateAccountNumber())
            .balance(BigDecimal.ZERO)
            .status(AccountStatus.ACTIVE)
            .build();
        
        return accountRepository.save(account);
    }

    public Account deposit(String accountId, BigDecimal amount) {
        Account account = getAccount(accountId);
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        account.setBalance(account.getBalance().add(amount));
        return accountRepository.save(account);
    }

    public Account withdraw(String accountId, BigDecimal amount) {
        Account account = getAccount(accountId);
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        account.setBalance(account.getBalance().subtract(amount));
        return accountRepository.save(account);
    }

    public BigDecimal getTotalBalance(String userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream()
            .filter(a -> a.getStatus() == AccountStatus.ACTIVE)
            .map(Account::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String generateAccountNumber() {
        return "ACC" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}