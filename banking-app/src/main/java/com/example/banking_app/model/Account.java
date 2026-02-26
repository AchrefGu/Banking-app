package com.example.banking_app.model;

import com.example.banking_app.model.enums.AccountStatus;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "accounts")
public class Account {
    @Id
    private String id;
    
    private String userId;
    
    private String accountNumber;
    
    private BigDecimal balance;
    
    private AccountStatus status;
}