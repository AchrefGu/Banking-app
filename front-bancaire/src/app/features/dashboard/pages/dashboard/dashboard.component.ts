import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Account, AccountResponse, Transaction } from '../../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">Banque App</div>
        <div class="nav-menu">
          <a routerLink="/dashboard" class="active">Dashboard</a>
          <a routerLink="/accounts">Mes Comptes</a>
          <a routerLink="/transactions">Transactions</a>
          
          <!-- Menu Admin (visible seulement pour les admins) -->
          <div *ngIf="isAdmin" class="admin-menu">
            <a routerLink="/admin/users">👥 Gérer les utilisateurs</a>
            <a routerLink="/admin/accounts">💰 Gérer les comptes</a>
          </div>
          
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <h1>Bonjour, {{ userName }} <span *ngIf="isAdmin" class="admin-badge">(Admin)</span></h1>

        <!-- Solde Total -->
        <div class="balance-card">
          <h3>Solde Total</h3>
          <div class="balance-amount">{{ totalBalance | currency:'EUR' }}</div>
        </div>

        <!-- Comptes -->
        <div class="accounts-section">
          <h2>Mes Comptes</h2>
          <div class="accounts-grid">
            <div *ngFor="let account of accounts" class="account-card">
              <div class="account-header">
                <span class="account-number">{{ account.accountNumber }}</span>
                <span class="account-status" [class.active]="account.status === 'ACTIVE'">
                  {{ account.status }}
                </span>
              </div>
              <div class="account-balance">
                {{ account.balance | currency:'EUR' }}
              </div>
              <a [routerLink]="['/transactions', account.id]" class="btn-view">
                Voir transactions
              </a>
            </div>
          </div>
        </div>

        <!-- Dernières Transactions -->
        <div class="transactions-section" *ngIf="recentTransactions.length > 0">
          <h2>Dernières Transactions</h2>
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of recentTransactions">
                <td>{{ transaction.timestamp | date:'short' }}</td>
                <td>
                  <span class="transaction-type" 
                        [class.deposit]="transaction.type === 'DEPOSIT'"
                        [class.withdrawal]="transaction.type === 'WITHDRAWAL'">
                    {{ transaction.type }}
                  </span>
                </td>
                <td>{{ transaction.description }}</td>
                <td [class.text-success]="transaction.type === 'DEPOSIT'"
                    [class.text-danger]="transaction.type === 'WITHDRAWAL'">
                  {{ transaction.amount | currency:'EUR' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f5f5;
    }
    .navbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }
    .nav-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    .nav-menu a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
    }
    .nav-menu a.active {
      color: #667eea;
    }
    .admin-menu {
      display: flex;
      gap: 1rem;
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 2px solid #e0e0e0;
    }
    .admin-menu a {
      color: #dc3545;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      background-color: #fff3f3;
    }
    .admin-menu a:hover {
      background-color: #dc3545;
      color: white;
      text-decoration: none;
    }
    .admin-badge {
      background-color: #dc3545;
      color: white;
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      margin-left: 0.5rem;
    }
    .btn-logout {
      background: none;
      border: 1px solid #dc3545;
      color: #dc3545;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-logout:hover {
      background: #dc3545;
      color: white;
    }
    .main-content {
      padding: 2rem;
    }
    .balance-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 10px;
      margin: 2rem 0;
    }
    .balance-amount {
      font-size: 3rem;
      font-weight: bold;
    }
    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .account-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .account-number {
      font-weight: bold;
      color: #333;
    }
    .account-status {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      background: #f0f0f0;
      font-size: 0.875rem;
    }
    .account-status.active {
      background: #d4edda;
      color: #155724;
    }
    .account-balance {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 1rem;
    }
    .btn-view {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .transactions-table {
      width: 100%;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .transactions-table th,
    .transactions-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .transactions-table th {
      background: #f8f9fa;
      font-weight: 600;
    }
    .transaction-type {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
    }
    .transaction-type.deposit {
      background: #d4edda;
      color: #155724;
    }
    .transaction-type.withdrawal {
      background: #f8d7da;
      color: #721c24;
    }
    .text-success {
      color: #28a745;
    }
    .text-danger {
      color: #dc3545;
    }
  `]
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  totalBalance = 0;
  recentTransactions: Transaction[] = [];
  userName = '';
  isAdmin = false;  // Déclarez la propriété ici

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
      this.isAdmin = user.role === 'ROLE_ADMIN';  // Vérifier si admin
      console.log('User role:', user.role, 'isAdmin:', this.isAdmin);  // Pour debug
    }
    this.loadData();
  }

  loadData(): void {
    // Charger les comptes
    this.apiService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        // Charger les transactions après avoir les comptes
        if (this.accounts.length > 0) {
          this.loadTransactions(this.accounts[0].id);
        }
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
      }
    });

    // Charger le solde total
    this.apiService.getTotalBalance().subscribe({
      next: (response: AccountResponse) => {
        this.totalBalance = response.totalBalance;
        // Ne pas réaffecter this.accounts ici pour éviter d'écraser
      },
      error: (error) => {
        console.error('Erreur chargement balance:', error);
      }
    });
  }

  loadTransactions(accountId: string): void {
    this.apiService.getAccountTransactions(accountId).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 5);
      },
      error: (error) => {
        console.error('Erreur chargement transactions:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}