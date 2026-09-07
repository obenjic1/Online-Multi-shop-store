import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  showPassword = signal(false);

  loginForm = this.fb.nonNullable.group({

    username: [
      '',
      [
        Validators.required
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]

  });

  submit(): void {

    this.errorMessage.set('');

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading.set(true);

    const request: LoginRequest = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };

    this.authService.login(request).subscribe({

      next: response => {

        this.loading.set(false);

        if (response.role === 'ROLE_SUPER_ADMIN') {
          this.router.navigate(['/super-admin']);
          return;
        }

        if (response.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
          return;
        }

        this.router.navigate(['/products']);

      },

      error: error => {

        this.loading.set(false);

        if (error.status === 401) {

          this.errorMessage.set(
            'Invalid username or password.'
          );

        } else {

          this.errorMessage.set(
            'Unable to sign in. Please try again.'
          );
        }
      }

    });
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }
}
