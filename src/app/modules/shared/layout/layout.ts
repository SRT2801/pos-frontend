import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { Header } from '../components/ui/header/header';
import { Router, RouterModule } from '@angular/router';
import { SidebarStateService } from '../services/sidebarState.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-layout',
  imports: [RouterModule, FormsModule, Sidebar, Header, ToastModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(
    public sidebarState: SidebarStateService,
    public router: Router,
  ) {}

  isAuthRoute(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
