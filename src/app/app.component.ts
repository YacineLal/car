import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './core/services/authentication.service';
import { LogoutButtonComponent } from './core/services/logout-button.component';
import { LoginModalComponent } from './login/login-modal.component';

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
  ],
})
export class AppComponent {
  constructor(private authService: AuthenticationService) {}

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
