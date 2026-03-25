import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/ui/input/input';
import { PasswordInputComponent } from '../../shared/components/ui/input/password-input';
import { AuthService } from '../../services/auth.service';

import { loginSchema } from '../../shared/schemas/login.schema';
import { ProgressSpinnerService } from '../../services/progress-spinner.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, InputComponent, PasswordInputComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = signal('');
  emailError = signal('');
  password = signal('');
  showPassword = signal(false);

  error = signal('');
  success = signal('');

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  constructor(
    private authService: AuthService,
    private spinner: ProgressSpinnerService,
    private toast: ToastService,
  ) {
    this.email.set('');
    this.password.set('');
    this.emailError.set('');
    this.error.set('');
    this.success.set('');
  }

  login() {
    this.error.set('');
    this.success.set('');
    this.emailError.set('');
    const formdata = {
      email: this.email(),
      password: this.password(),
    };

    const result = loginSchema.safeParse(formdata);

    if (!result.success) {
      this.email.set('');
      this.password.set('');

      result.error.issues.forEach((issue) => {
        if (issue.path.includes('email')) {
          this.emailError.set(issue.message);
        }
        if (issue.path.includes('password')) {
          this.password.set('');
        }
      });
      return;
    }

    this.error.set('');
    this.spinner.show();
    this.authService.login(formdata).subscribe({
      next: () => {
        this.toast.success('Login successful');
        this.email.set('');
        this.password.set('');
        this.spinner.hide();
      },
      error: (err) => {
        const message = err.error?.message || 'Login failed';
        this.error.set(message);
        this.toast.error(message);
        this.password.set('');
        this.spinner.hide();
      },
    });
  }
}
