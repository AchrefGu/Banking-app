import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Account } from '../../../../core/models';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="accounts-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">Banque App - Administration</div>
        <div class="nav-menu">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/admin/users">Utilisateurs</a>
          <a routerLink="/admin/accounts" class="active">Comptes</a>
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <div class="header">
          <h1>Gestion des comptes</h1>
          <div class="stats">
            <div class="stat-card">
              <span class="stat-label">Total comptes</span>
              <span class="stat-value">{{ accounts.length }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Solde total</span>
              <span class="stat-value">{{ totalBalance | currency:'EUR' }}</span>
            </div>
          </div>
        </div>

        <!-- Tableau des comptes -->
        <div class="accounts-table-container">
          <table class="accounts-table">
            <thead>
              <tr>
                <th>N° Compte</th>
                <th>Utilisateur ID</th>
                <th>Solde</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let account of accounts">
                <td>{{ account.accountNumber }}</td>
                <td>{{ account.userId | slice:0:8 }}...</td>
                <td>{{ account.balance | currency:'EUR' }}</td>
                <td>
                  <span class="status-badge" [class.active]="account.status === 'ACTIVE'">
                    {{ account.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" (click)="toggleAccountStatus(account)">
                    {{ account.status === 'ACTIVE' ? 'Bloquer' : 'Activer' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accounts-container {
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
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .stats {
      display: flex;
      gap: 1rem;
    }
    .stat-card {
      background: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-label {
      display: block;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
    .accounts-table-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    .accounts-table {
      width: 100%;
      border-collapse: collapse;
    }
    .accounts-table th,
    .accounts-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .accounts-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    .accounts-table tbody tr:hover {
      background: #f8f9fa;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
      background: #f0f0f0;
    }
    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }
    .btn-edit {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-edit:hover {
      background: #5a67d8;
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  totalBalance = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.apiService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateTotalBalance();
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
      }
    });
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  toggleAccountStatus(account: Account): void {
    const newStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    // Appel API pour changer le statut (à implémenter)
    console.log('Changer statut:', account.id, '->', newStatus);
  }

  logout(): void {
    this.authService.logout();
  }
}