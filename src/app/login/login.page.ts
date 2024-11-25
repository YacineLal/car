import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Router, RouterModule} from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { ErrorModalService } from '../core/services/error-modal.service';
import {ErrorModalComponent} from "../../modals/error.modal.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ErrorModalComponent
  ]
})
export class LoginPage implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  public passwordType = 'password';
  public passwordIcon = 'eye-outline';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  private errorModalService: ErrorModalService

) {}

  ngOnInit() {
    // Initialization logic here
  }

  public onToggleShowPassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-off-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-outline';
    }
  }


  public onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value!;
      const password = this.loginForm.get('password')?.value!;
      this.authenticationService.signInWithEmailAndPassword(email, password)
        .then(() => {
          // Refresh state explicitly after login
          this.authenticationService.checkAuthState().then(() => {
            this.router.navigate(['home']);
          });
        })
        .catch((error: any) => {
          console.error('Login error:', error);

          // Handle error cases
          let errorMessage = 'An unknown error occurred. Please try again.';
          if (error.code === 'auth/invalid-credential') {
            errorMessage = 'The email address or password are invalid.';
          }  else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection.';
          }

          // Show the error in the modal
          this.errorModalService.showModal(errorMessage);
        });
    }
  }

}
