import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './core/services/authentication.service';
import { LogoutButtonComponent } from './core/services/logout-button.component';
import { LoginModalComponent } from '../modals/login-modal.component';
import { ErrorModalComponent } from '../modals/error.modal.component';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
    LogoutButtonComponent,
    LoginModalComponent,
    ErrorModalComponent,
  ],
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private modalController: ModalController,
    private router: Router

  ) {
    addIcons({ ...icons });

  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  async showErrorModal(message: string) {
    const modal = await this.modalController.create({
      component: ErrorModalComponent,
      componentProps: {
        errorMessage: message,
      }
    });
    await modal.present();
  }

  navigateToCarList() {
    this.router.navigate(['/car-list']);
  }

  navigateToCreateCar() {
    this.router.navigate(['/car-create']);
  }

  public onLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }
}
