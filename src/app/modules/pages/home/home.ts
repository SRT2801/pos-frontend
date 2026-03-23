import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly newsletterEmail = signal('');

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    // Aquí puedes conectar con tu API o ToastService
    this.newsletterEmail.set('');
  }
}
