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