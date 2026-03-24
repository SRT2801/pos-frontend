import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/components/ui/footer/footer';

@Component({
  selector: 'app-home',
  imports: [FormsModule, Footer],
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
