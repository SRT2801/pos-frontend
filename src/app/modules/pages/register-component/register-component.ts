import { Component } from '@angular/core';
import { registerSchema } from '../../shared/schemas/register.schema';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register-component',
  imports: [FormsModule, ButtonModule, CommonModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService) {}

  register() {
    const result = registerSchema.safeParse({ email: this.email, password: this.password });
    if (!result.success) {
      this.error = result.error.issues.map((e) => e.message).join(', ');
      this.success = '';
      return;
    }
    this.error = '';
    this.success = '';
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: (data) => {
        this.success = 'Registro exitoso';
        this.error = '';
        // Puedes redirigir o mostrar mensaje de éxito aquí
      },
      error: (err) => {
        this.error = err.error?.message || 'Error en el registro';
        this.success = '';
      },
    });
  }
}
