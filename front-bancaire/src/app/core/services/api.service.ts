import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, RegisterRequest, AuthResponse,
  Account, AccountResponse, Transaction, TransactionRequest,
  User
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, userData);
  }

  // Accounts
  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/api/accounts/my-accounts`);
  }

  getTotalBalance(): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.apiUrl}/api/accounts/balance`);
  }

  // Transactions
  createTransaction(request: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/api/transactions`, request);
  }

  getAccountTransactions(accountId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/api/transactions/account/${accountId}`);
  }

  // Admin (si role admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/admin/users`);
  }

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/api/admin/accounts`);
  }


deleteUser(userId: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/api/admin/users/${userId}`);
}

updateUserRole(userId: string, role: string): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/api/admin/users/${userId}/role`, { role });
}

}