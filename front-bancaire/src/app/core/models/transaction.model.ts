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