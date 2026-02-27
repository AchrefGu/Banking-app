import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Vérifier si l'utilisateur est admin pour les routes admin
          const user = this.authService.getUser();
          const currentUrl = this.router.url;
          
          // Si c'est une route admin et que l'utilisateur n'est pas admin
          if (currentUrl.includes('/admin/') && user?.role !== 'ROLE_ADMIN') {
            console.log('Accès admin refusé - rôle:', user?.role);
            return this.router.createUrlTree(['/dashboard']);
          }
          
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}