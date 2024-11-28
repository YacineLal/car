import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from './authentication.service';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button-component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class LogoutButtonComponent {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    addIcons({ ...icons });

  }

  public onLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }
}
