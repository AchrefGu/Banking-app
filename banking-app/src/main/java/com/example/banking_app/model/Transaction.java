package com.example.banking_app.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    
    private String accountId;
    
    private String type; // DEPOSIT, WITHDRAWAL, TRANSFER
    
    private BigDecimal amount;
    
    private LocalDateTime timestamp;
    
    private String description;
    
    private String targetAccountId;
}