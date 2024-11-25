import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService, IUser } from '../core/services/authentication.service';
import { ErrorModalService } from '../core/services/error-modal.service';
import { ErrorModalComponent } from '../../modals/error.modal.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
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
export class SignupPage implements OnInit {
  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator as ValidatorFn });
  public passwordType = 'password';
  public passwordIcon = 'eye-outline';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private errorModalService: ErrorModalService // Inject ErrorModalService
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

  public passwordMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  public onSignUp(): void {
    if (this.signupForm.valid) {
      const user: IUser = {
        fullName: this.signupForm.get('username')?.value!,
        email: this.signupForm.get('email')?.value!,
        password: this.signupForm.get('password')?.value!
      };

      this.authenticationService.signUpWithEmailAndPassword(user)
        .then(() => {
          console.log('User created successfully, navigating to login page');
          this.router.navigate(['login']);
        })
        .catch((error: any) => {
          let errorMessage = 'An unknown error occurred. Please try again.';

          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'The email address is already in use by another account.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is not properly formatted.';
              break;
            case 'auth/operation-not-allowed':
              errorMessage = 'Email/password accounts are not enabled.';
              break;
            case 'auth/weak-password':
              errorMessage = 'The password is too weak. Please provide a stronger password.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'auth/internal-error':
              errorMessage = 'An internal error occurred. Please try again later.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many attempts. Please try again later.';
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
