import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.authService.checkAuthState().then(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['/car-list']);
          observer.next(false);
          observer.complete();
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }
}
