import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service'; // Vérifiez ce chemin
import { LoginRequest } from '../../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              class="form-control" 
              [(ngModel)]="credentials.email" 
              name="email"
              required
              email
              #email="ngModel">
            <div *ngIf="email.invalid && email.touched" class="text-danger">
              Email valide requis
            </div>
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="credentials.password" 
              name="password"
              required
              minlength="6"
              #password="ngModel">
            <div *ngIf="password.invalid && password.touched" class="text-danger">
              Mot de passe requis (min 6 caractères)
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100" 
            [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <div *ngIf="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>

          <p class="mt-3 text-center">
            Pas encore de compte ? <a routerLink="/register">S'inscrire</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .login-card h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
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
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      padding: 0.75rem;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .w-100 {
      width: 100%;
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
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur de connexion';
      }
    });
  }
}