import { Component, inject, signal } from '@angular/core';
import { registerSchema } from '../../shared/schemas/register.schema';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/ui/input/input';
import { PasswordInputComponent } from '../../shared/components/ui/input/password-input';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerService  } from '../../services/progress-spinner.service';

@Component({
  imports: [CommonModule, FormsModule, InputComponent, PasswordInputComponent, RouterLink],
  selector: 'app-register-store',
  templateUrl: './register-store.html',
  styleUrl: './register-store.css',
})
export class RegisterStore {
  email = signal('');
  password = signal('');
  storeName = signal('');
  storeSlug = signal('');
  confirmPassword = signal('');

  error = signal('');
  success = signal('');
  emailError = signal('');
  passwordError = signal('');
  storeNameError = signal('');
  storeSlugError = signal('');

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private spinner = inject(ProgressSpinnerService);
  

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

  registerStore() {
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
      storeName: this.storeName(),
      storeSlug: this.storeSlug(),
    };

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      this.emailError.set('');
      this.passwordError.set('');
      this.storeNameError.set('');
      this.storeSlugError.set('');

      result.error.issues.forEach((issue) => {
        if (issue.path.includes('email')) {
          this.emailError.set(issue.message);
        }
        if (issue.path.includes('password')) {
          this.passwordError.set(issue.message);
        }
        if (issue.path.includes('storeName')) {
          this.storeNameError.set(issue.message);
        }
        if (issue.path.includes('storeSlug')) {
          this.storeSlugError.set(issue.message);
        }
      });
      return;
    }

    this.error.set('');
    this.spinner.show();
    this.authService.registerStore(formData).subscribe({
      next: () => {
        this.toast.success('Registro exitoso');
        this.email.set('');
        this.password.set('');
        this.confirmPassword.set('');
        this.storeName.set('');
        this.storeSlug.set('');
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
