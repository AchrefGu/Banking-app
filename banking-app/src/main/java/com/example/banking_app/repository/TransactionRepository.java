package com.example.banking_app.repository;

import com.example.banking_app.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAccountId(String accountId);
    List<Transaction> findByAccountIdOrderByTimestampDesc(String accountId);
}