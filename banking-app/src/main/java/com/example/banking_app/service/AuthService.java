package com.example.banking_app.service;

import com.example.banking_app.dto.LoginRequest;
import com.example.banking_app.dto.RegisterRequest;
import com.example.banking_app.model.User;
import com.example.banking_app.model.Account;
import com.example.banking_app.model.enums.Role;
import com.example.banking_app.model.enums.AccountStatus;
import com.example.banking_app.repository.UserRepository;
import com.example.banking_app.repository.AccountRepository;
import com.example.banking_app.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Compter le nombre d'utilisateurs existants
        long userCount = userRepository.count();
        
        // Créer l'utilisateur avec le rôle approprié
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(userCount == 0 ? Role.ROLE_ADMIN : Role.ROLE_USER) // Premier utilisateur = ADMIN
            .build();

        user = userRepository.save(user);

        // Créer un compte pour l'utilisateur
        Account account = Account.builder()
            .userId(user.getId())
            .accountNumber(generateAccountNumber())
            .balance(BigDecimal.ZERO)
            .status(AccountStatus.ACTIVE)
            .build();

        accountRepository.save(account);

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole()); // Sera ROLE_ADMIN pour le premier utilisateur

        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole());

        return response;
    }

    private String generateAccountNumber() {
        return "ACC" + System.currentTimeMillis();
    }
}