import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './core/services/authentication.service';
import { LogoutButtonComponent } from './core/services/logout-button.component';
import { LoginModalComponent } from '../modals/login-modal.component';
import {ErrorModalComponent} from "../modals/error.modal.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    CommonModule, // Use CommonModule here instead of BrowserModule
    LogoutButtonComponent,
    LoginModalComponent,
    ErrorModalComponent, // Include ErrorModalComponent here
  ],
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private modalController: ModalController // Inject the ModalController to show the error modal
  ) {}

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Function to open error modal
  async showErrorModal(message: string) {
    const modal = await this.modalController.create({
      component: ErrorModalComponent,
      componentProps: {
        errorMessage: message,
      }
    });
    await modal.present();
  }
}
