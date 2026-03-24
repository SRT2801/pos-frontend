import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/ui/input/input';
import { PasswordInputComponent } from '../../shared/components/ui/input/password-input';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, InputComponent, PasswordInputComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Aquí podrías agregar lógica de login si lo deseas
}
