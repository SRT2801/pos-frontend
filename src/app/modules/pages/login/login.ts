import { Component, inject } from '@angular/core';;
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/components/ui/footer/footer';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

}
