import { Component, signal } from '@angular/core';
import { registerSchema } from '../../shared/schemas/register.schema';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/ui/input/input';
import { PasswordInputComponent } from '../../shared/components/ui/input/password-input';
import { ProgressSpinnerService } from '../../services/progress-spinner.service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, InputComponent, PasswordInputComponent],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  error = signal('');
  success = signal('');
  emailError = signal('');
  passwordError = signal('');

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private spinner: ProgressSpinnerService,
  ) {
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');
    this.error.set('');
    this.success.set('');
    this.emailError.set('');
    this.passwordError.set('');
  }

  get passwordsMatch() {
    return this.password() === this.confirmPassword() && this.confirmPassword() !== '';
  }

  get confirmPasswordTouched() {
    return this.confirmPassword() !== '';
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  register() {
    this.error.set('');
    this.success.set('');
    this.emailError.set('');
    this.passwordError.set('');

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    const formData = {
      email: this.email(),
      password: this.password(),
    };

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      this.emailError.set('');
      this.passwordError.set('');

      result.error.issues.forEach((issue) => {
        if (issue.path.includes('email')) {
          this.emailError.set(issue.message);
        }
        if (issue.path.includes('password')) {
          this.passwordError.set(issue.message);
        }
      });
      return;
    }

    this.error.set('');
    this.spinner.show();
    this.authService.register(formData).subscribe({
      next: () => {
        this.toast.success('Registro exitoso');
        this.email.set('');
        this.password.set('');
        this.confirmPassword.set('');
        this.spinner.hide();
      },
      error: (err) => {
        const message = err.error?.message || 'Error en el registro';
        this.error.set(message);
        this.toast.error(message);
        this.spinner.hide();
      },
    });
  }
}
