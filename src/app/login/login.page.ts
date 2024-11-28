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
          console.log('Login successful');
          this.router.navigate(['car-list']);
        })
        .catch((error: any) => {
          let errorMessage = 'An unknown error occurred. Please try again.';

          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No user found with this email. Please sign up.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is not properly formatted.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This user account has been disabled. Please contact support.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many login attempts. Please try again later.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'auth/internal-error':
              errorMessage = 'An internal error occurred. Please try again later.';
              break;
            case 'auth/missing-password':
              errorMessage = 'Password is required. Please enter your password.';
              break;
            case 'auth/invalid-credential':
              errorMessage = 'The password or email are invalid. Please try again.';
              break;
            case 'auth/account-exists-with-different-credential':
              errorMessage = 'An account already exists with this email but a different sign-in method. Try another method.';
              break;
            default:
              errorMessage = error.message || errorMessage;
          }

          // Show the error in a modal
          this.errorModalService.showModal(errorMessage);
        });
    }
  }


}
