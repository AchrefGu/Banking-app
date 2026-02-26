package com.example.banking_app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {
    private String accountId;
    private String type;
    private BigDecimal amount;
    private String description;
    private String targetAccountId;
}