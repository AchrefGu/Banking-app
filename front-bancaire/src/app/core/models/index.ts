// Modèle User
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

// Authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

// Modèle Account
export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN' | 'CLOSED';
}

export interface AccountResponse {
  totalBalance: number;
  accounts: Account[];
}

// Modèle Transaction
export interface Transaction {
  id: string;
  accountId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  timestamp: Date;
  description: string;
  targetAccountId?: string;
}

export interface TransactionRequest {
  accountId: string;
  type: string;
  amount: number;
  description: string;
  targetAccountId?: string;
}