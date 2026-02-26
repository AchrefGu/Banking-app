package com.example.banking_app.repository;

import com.example.banking_app.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends MongoRepository<Account, String> {
    List<Account> findByUserId(String userId);
    Optional<Account> findByAccountNumber(String accountNumber);
}