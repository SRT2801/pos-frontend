import { Component } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebarState.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { usesMinimalLayout } from '../../../layout/minimal-layout.util';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    public sidebarState: SidebarStateService,
    public router: Router,
  ) {}

  hideSidebarButton(): boolean {
    return usesMinimalLayout(this.router.url);
  }
}
