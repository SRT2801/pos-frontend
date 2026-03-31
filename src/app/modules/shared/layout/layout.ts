import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { Header } from '../components/ui/header/header';
import { Router, RouterModule } from '@angular/router';
import { SidebarStateService } from '../services/sidebarState.service';
import { ToastModule } from 'primeng/toast';
import { usesMinimalLayout } from './minimal-layout.util';
import { AppProgressSpinner } from '../components/ui/progress-spinner/progress-spinner';
import { ProgressSpinnerService } from '../services/progress-spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    FormsModule,
    Sidebar,
    Header,
    ToastModule,
    AppProgressSpinner,
    CommonModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  protected readonly spinner = inject(ProgressSpinnerService);
  constructor(
    public sidebarState: SidebarStateService,
    public router: Router,
  ) {}

  isMinimalLayout(): boolean {
    return usesMinimalLayout(this.router.url);
  }
}
