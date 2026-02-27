import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="users-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">Banque App - Administration</div>
        <div class="nav-menu">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/admin/users" class="active">Utilisateurs</a>
          <a routerLink="/admin/accounts">Comptes</a>
          <button class="btn-logout" (click)="logout()">Déconnexion</button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">
        <div class="header">
          <h1>Gestion des utilisateurs</h1>
          <div class="stats">
            <div class="stat-card">
              <span class="stat-label">Total utilisateurs</span>
              <span class="stat-value">{{ users.length }}</span>
            </div>
          </div>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.id | slice:0:8 }}...</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class.admin]="user.role === 'ROLE_ADMIN'">
                    {{ user.role === 'ROLE_ADMIN' ? 'Admin' : 'Utilisateur' }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" (click)="editUser(user)">✏️</button>
                  <button class="btn-delete" (click)="deleteUser(user.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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
    .users-table-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
    }
    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .users-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    .users-table tbody tr:hover {
      background: #f8f9fa;
    }
    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.875rem;
      background: #e9ecef;
      color: #495057;
    }
    .role-badge.admin {
      background: #cce5ff;
      color: #004085;
    }
    .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      margin: 0 0.25rem;
    }
    .btn-edit:hover {
      color: #007bff;
    }
    .btn-delete:hover {
      color: #dc3545;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs:', error);
        alert('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  editUser(user: User): void {
    // À implémenter : modifier le rôle par exemple
    console.log('Éditer utilisateur:', user);
  }

  deleteUser(userId: string): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    this.apiService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        alert('Utilisateur supprimé avec succès');
      },
      error: (error: any) => {  // Notez le ": any" ici
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    });
  }
}

  logout(): void {
    this.authService.logout();
  }
}