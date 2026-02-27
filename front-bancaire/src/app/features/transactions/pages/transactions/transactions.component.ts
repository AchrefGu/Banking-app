import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Transaction, Account } from '../../../../core/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="transactions-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">Banque App</div>
        <div class="nav-menu">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/accounts">Mes Comptes</a>
          <a routerLink="/transactions" class="active">Transactions</a>
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <div class="header">
          <h1>Historique des transactions</h1>
          
          <!-- Filtres -->
          <div class="filters">
            <select class="form-control" [(ngModel)]="selectedAccountId" (change)="filterTransactions()">
              <option value="">Tous les comptes</option>
              <option *ngFor="let account of accounts" [value]="account.id">
                Compte {{ account.accountNumber }}
              </option>
            </select>

            <select class="form-control" [(ngModel)]="selectedType" (change)="filterTransactions()">
              <option value="">Tous les types</option>
              <option value="DEPOSIT">Dépôts</option>
              <option value="WITHDRAWAL">Retraits</option>
              <option value="TRANSFER">Virements</option>
            </select>

            <input type="date" class="form-control" [(ngModel)]="selectedDate" (change)="filterTransactions()">
          </div>
        </div>

        <!-- Résumé -->
        <div class="summary-cards" *ngIf="filteredTransactions.length > 0">
          <div class="summary-card">
            <div class="summary-label">Total des dépôts</div>
            <div class="summary-value text-success">{{ totalDeposits | currency:'EUR' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total des retraits</div>
            <div class="summary-value text-danger">{{ totalWithdrawals | currency:'EUR' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Nombre de transactions</div>
            <div class="summary-value">{{ filteredTransactions.length }}</div>
          </div>
        </div>

        <!-- Tableau des transactions -->
        <div class="transactions-table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Compte</th>
                <th>Type</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of filteredTransactions">
                <td>{{ transaction.timestamp | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span class="account-badge">
                    {{ getAccountNumber(transaction.accountId) }}
                  </span>
                </td>
                <td>
                  <span class="transaction-type" 
                        [class.deposit]="transaction.type === 'DEPOSIT'"
                        [class.withdrawal]="transaction.type === 'WITHDRAWAL'"
                        [class.transfer]="transaction.type === 'TRANSFER'">
                    {{ transaction.type }}
                  </span>
                </td>
                <td>{{ transaction.description }}</td>
                <td [class.text-success]="transaction.type === 'DEPOSIT'"
                    [class.text-danger]="transaction.type === 'WITHDRAWAL'"
                    [class.text-primary]="transaction.type === 'TRANSFER'">
                  {{ transaction.amount | currency:'EUR' }}
                </td>
                <td>
                  <span class="status-badge completed">Complété</span>
                </td>
              </tr>
              <tr *ngIf="filteredTransactions.length === 0">
                <td colspan="6" class="text-center">Aucune transaction trouvée</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
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
    .header h1 {
      margin: 0;
      color: #333;
    }
    .filters {
      display: flex;
      gap: 1rem;
    }
    .form-control {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      min-width: 150px;
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary-label {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .summary-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .transactions-table-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    .transactions-table {
      width: 100%;
      border-collapse: collapse;
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
      color: #333;
    }
    .transactions-table tbody tr:hover {
      background: #f8f9fa;
    }
    .account-badge {
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
      color: #495057;
    }
    .transaction-type {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .transaction-type.deposit {
      background: #d4edda;
      color: #155724;
    }
    .transaction-type.withdrawal {
      background: #f8d7da;
      color: #721c24;
    }
    .transaction-type.transfer {
      background: #cce5ff;
      color: #004085;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
    }
    .status-badge.completed {
      background: #d4edda;
      color: #155724;
    }
    .text-success {
      color: #28a745;
      font-weight: 600;
    }
    .text-danger {
      color: #dc3545;
      font-weight: 600;
    }
    .text-primary {
      color: #007bff;
      font-weight: 600;
    }
    .text-center {
      text-align: center;
      color: #999;
      padding: 2rem;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  accounts: Account[] = [];
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  selectedAccountId: string = '';
  selectedType: string = '';
  selectedDate: string = '';

  totalDeposits: number = 0;
  totalWithdrawals: number = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Vérifier si un accountId est dans l'URL
    this.route.params.subscribe(params => {
      if (params['accountId']) {
        this.selectedAccountId = params['accountId'];
      }
    });
  }

  loadData(): void {
    // Charger les comptes
    this.apiService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loadAllTransactions();
      }
    });
  }

  loadAllTransactions(): void {
    // Charger les transactions pour chaque compte
    const transactionPromises = this.accounts.map(account => 
      this.apiService.getAccountTransactions(account.id).toPromise()
    );

    Promise.all(transactionPromises).then((transactionsArrays) => {
      this.allTransactions = transactionsArrays
        .flat()
        .filter(t => t !== undefined)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      this.filterTransactions();
    });
  }

  filterTransactions(): void {
    this.filteredTransactions = this.allTransactions.filter(transaction => {
      let matches = true;

      if (this.selectedAccountId) {
        matches = matches && transaction.accountId === this.selectedAccountId;
      }

      if (this.selectedType) {
        matches = matches && transaction.type === this.selectedType;
      }

      if (this.selectedDate) {
        const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
        matches = matches && transactionDate === this.selectedDate;
      }

      return matches;
    });

    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalDeposits = this.filteredTransactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalWithdrawals = this.filteredTransactions
      .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getAccountNumber(accountId: string): string {
    const account = this.accounts.find(a => a.id === accountId);
    return account ? account.accountNumber : 'Compte inconnu';
  }

  logout(): void {
    this.authService.logout();
  }
}