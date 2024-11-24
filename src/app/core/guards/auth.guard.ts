import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ModalService } from '../services/modal.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private modalService: ModalService
  ) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      console.log('AuthGuard: Current User:', this.authService.isLoggedIn());

      this.authService.checkAuthState().then(isLoggedIn => {
        if (isLoggedIn) {
          console.log('AuthGuard: Current User:', this.authService.isLoggedIn());

          observer.next(true);
          observer.complete();
        } else {
          console.log('AuthGuard: Current User:', this.authService.isLoggedIn());

          this.modalService.showModal();
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
