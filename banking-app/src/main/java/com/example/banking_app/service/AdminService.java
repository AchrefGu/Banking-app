package com.example.banking_app.service;

import com.example.banking_app.model.User;
import com.example.banking_app.model.Account;
import com.example.banking_app.model.enums.Role;
import com.example.banking_app.model.enums.AccountStatus;
import com.example.banking_app.repository.UserRepository;
import com.example.banking_app.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account activateAccount(String accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        account.setStatus(AccountStatus.ACTIVE);
        return accountRepository.save(account);
    }

    public Account deactivateAccount(String accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        account.setStatus(AccountStatus.INACTIVE);
        return accountRepository.save(account);
    }

    public void deleteUser(String userId) {
        // First delete all accounts of the user
        List<Account> userAccounts = accountRepository.findByUserId(userId);
        accountRepository.deleteAll(userAccounts);
        
        // Then delete the user
        userRepository.deleteById(userId);
    }

    public User changeUserRole(String userId, Role newRole) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setRole(newRole);
        return userRepository.save(user);
    }
}