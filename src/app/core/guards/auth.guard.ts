import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isLoggedIn()) {
      const alert = await this.alertController.create({
        header: 'Already Logged In',
        message: 'You are already logged in.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
