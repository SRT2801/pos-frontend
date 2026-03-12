import { Component } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebarState.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public sidebarState: SidebarStateService) {}
}
