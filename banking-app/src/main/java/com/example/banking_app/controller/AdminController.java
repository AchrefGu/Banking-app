package com.example.banking_app.controller;

import com.example.banking_app.model.User;
import com.example.banking_app.model.Account;
import com.example.banking_app.model.enums.Role;
import com.example.banking_app.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @PutMapping("/accounts/{accountId}/activate")
    public ResponseEntity<?> activateAccount(@PathVariable String accountId) {
        try {
            Account account = adminService.activateAccount(accountId);
            return ResponseEntity.ok(Map.of(
                "message", "Account activated successfully",
                "account", account
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/accounts/{accountId}/deactivate")
    public ResponseEntity<?> deactivateAccount(@PathVariable String accountId) {
        try {
            Account account = adminService.deactivateAccount(accountId);
            return ResponseEntity.ok(Map.of(
                "message", "Account deactivated successfully",
                "account", account
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable String userId, @RequestBody Map<String, String> request) {
        try {
            Role newRole = Role.valueOf(request.get("role"));
            User user = adminService.changeUserRole(userId, newRole);
            return ResponseEntity.ok(Map.of(
                "message", "User role updated successfully",
                "user", user
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}