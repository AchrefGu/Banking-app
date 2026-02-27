import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Account, Transaction, TransactionRequest } from '../../../../core/models';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="accounts-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">Banque App</div>
        <div class="nav-menu">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/accounts" class="active">Mes Comptes</a>
          <a routerLink="/transactions">Transactions</a>
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <h1>Mes Comptes Bancaires</h1>

        <!-- Liste des comptes -->
        <div class="accounts-grid">
          <div *ngFor="let account of accounts" class="account-card">
            <div class="account-header">
              <div>
                <h3>Compte {{ account.accountNumber }}</h3>
                <span class="account-status" [class.active]="account.status === 'ACTIVE'">
                  {{ account.status }}
                </span>
              </div>
              <button class="btn-transaction" (click)="openTransactionModal(account)">
                Nouvelle transaction
              </button>
            </div>

            <div class="account-details">
              <div class="balance">
                <label>Solde</label>
                <div class="amount">{{ account.balance | currency:'EUR' }}</div>
              </div>
            </div>

            <!-- Mini historique des transactions -->
            <div class="recent-transactions" *ngIf="accountTransactions[account.id]?.length">
              <h4>Dernières transactions</h4>
              <div *ngFor="let transaction of accountTransactions[account.id] | slice:0:3" 
                   class="transaction-item">
                <span class="transaction-date">{{ transaction.timestamp | date:'dd/MM/yyyy' }}</span>
                <span class="transaction-type" 
                      [class.deposit]="transaction.type === 'DEPOSIT'"
                      [class.withdrawal]="transaction.type === 'WITHDRAWAL'">
                  {{ transaction.type }}
                </span>
                <span class="transaction-amount" 
                      [class.text-success]="transaction.type === 'DEPOSIT'"
                      [class.text-danger]="transaction.type === 'WITHDRAWAL'">
                  {{ transaction.amount | currency:'EUR' }}
                </span>
              </div>
              <a [routerLink]="['/transactions', account.id]" class="view-all">
                Voir toutes les transactions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de transaction -->
    <div class="modal" [class.show]="showTransactionModal" (click)="closeModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nouvelle transaction</h2>
          <button class="close" (click)="showTransactionModal = false">&times;</button>
        </div>

        <div class="modal-body">
          <p class="account-info">
            Compte: {{ selectedAccount?.accountNumber }}<br>
            Solde disponible: {{ selectedAccount?.balance | currency:'EUR' }}
          </p>

          <form #transactionForm="ngForm" (ngSubmit)="onSubmitTransaction()">
            <div class="form-group">
              <label>Type de transaction</label>
              <select class="form-control" [(ngModel)]="transactionData.type" 
                      name="type" required #type="ngModel">
                <option value="DEPOSIT">Dépôt</option>
                <option value="WITHDRAWAL">Retrait</option>
                <option value="TRANSFER">Virement</option>
              </select>
            </div>

            <div class="form-group" *ngIf="transactionData.type === 'TRANSFER'">
              <label>Compte destinataire</label>
              <input type="text" class="form-control" 
                     [(ngModel)]="transactionData.targetAccountId" 
                     name="targetAccountId" required>
            </div>

            <div class="form-group">
              <label>Montant</label>
              <input type="number" class="form-control" 
                     [(ngModel)]="transactionData.amount" 
                     name="amount" required min="0.01" step="0.01"
                     #amount="ngModel">
              <div *ngIf="amount.invalid && amount.touched" class="text-danger">
                Montant invalide
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <input type="text" class="form-control" 
                     [(ngModel)]="transactionData.description" 
                     name="description" required>
            </div>

            <div *ngIf="transactionError" class="alert alert-danger">
              {{ transactionError }}
            </div>

            <button type="submit" class="btn-submit" 
                    [disabled]="transactionForm.invalid || transactionLoading">
              {{ transactionLoading ? 'Traitement...' : 'Effectuer la transaction' }}
            </button>
          </form>
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
    .accounts-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 2rem;
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
    .account-header h3 {
      margin: 0 0 0.5rem 0;
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
    .btn-transaction {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .btn-transaction:hover {
      background: #5a67d8;
    }
    .account-details {
      margin: 1rem 0;
      padding: 1rem 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
    .balance label {
      color: #666;
      font-size: 0.875rem;
    }
    .amount {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
    .recent-transactions {
      margin-top: 1rem;
    }
    .recent-transactions h4 {
      margin-bottom: 0.5rem;
      color: #666;
    }
    .transaction-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .transaction-date {
      color: #999;
      font-size: 0.875rem;
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
    .transaction-amount {
      font-weight: bold;
    }
    .text-success {
      color: #28a745;
    }
    .text-danger {
      color: #dc3545;
    }
    .view-all {
      display: inline-block;
      margin-top: 0.5rem;
      color: #667eea;
      text-decoration: none;
    }
    .view-all:hover {
      text-decoration: underline;
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .modal.show {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      border-radius: 10px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .modal-header h2 {
      margin: 0;
      color: #333;
    }
    .close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
    }
    .close:hover {
      color: #333;
    }
    .modal-body {
      padding: 1rem;
    }
    .account-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 5px;
      margin-bottom: 1rem;
      color: #666;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    .btn-submit {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-submit:hover:not(:disabled) {
      background: #5a67d8;
    }
    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .text-danger {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .alert {
      padding: 0.75rem;
      border-radius: 5px;
      margin-bottom: 1rem;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
  `]
})
export class AccountsListComponent implements OnInit {
  accounts: Account[] = [];
  accountTransactions: { [key: string]: Transaction[] } = {};
  showTransactionModal = false;
  selectedAccount: Account | null = null;
  transactionData: TransactionRequest = {
    accountId: '',
    type: 'DEPOSIT',
    amount: 0,
    description: '',
    targetAccountId: ''
  };
  transactionLoading = false;
  transactionError = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.apiService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        accounts.forEach(account => {
          this.loadAccountTransactions(account.id);
        });
      },
      error: (error) => {
        console.error('Erreur chargement comptes', error);
      }
    });
  }

  loadAccountTransactions(accountId: string): void {
    this.apiService.getAccountTransactions(accountId).subscribe({
      next: (transactions) => {
        this.accountTransactions[accountId] = transactions;
      }
    });
  }

  openTransactionModal(account: Account): void {
    this.selectedAccount = account;
    this.transactionData = {
      accountId: account.id,
      type: 'DEPOSIT',
      amount: 0,
      description: '',
      targetAccountId: ''
    };
    this.transactionError = '';
    this.showTransactionModal = true;
  }

  closeModal(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showTransactionModal = false;
    }
  }

  onSubmitTransaction(): void {
    this.transactionLoading = true;
    this.transactionError = '';

    this.apiService.createTransaction(this.transactionData).subscribe({
      next: () => {
        this.transactionLoading = false;
        this.showTransactionModal = false;
        this.loadAccounts(); // Recharger les données
      },
      error: (error) => {
        this.transactionLoading = false;
        this.transactionError = error.error?.message || 'Erreur lors de la transaction';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}