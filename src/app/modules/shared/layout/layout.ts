import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { Header } from '../components/ui/header/header';
import { RouterModule } from '@angular/router';
import { SidebarStateService } from '../services/sidebarState.service';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, FormsModule, Sidebar, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(public sidebarState: SidebarStateService) {}
}
