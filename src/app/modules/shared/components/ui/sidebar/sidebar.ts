import { Component, signal } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebarState.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';

export interface SidebarOption {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarOption[];
}

@Component({
  selector: 'app-sidebar',
  imports: [AvatarModule, DrawerModule, ButtonModule, RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar {
  visible = signal(false);

  submenusOpen = new Map<string, boolean>();

  options: SidebarOption[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/home',
    },
    {
      label: 'Registro',
      icon: 'pi pi-user-plus',
      children: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          route: '/clients',
        },
      ],
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      children: [
        {
          label: 'Lista',
          icon: 'pi pi-list',
          route: '/products',
        },
        {
          label: 'Agregar',
          icon: 'pi pi-plus',
          route: '/products/add',
        },
      ],
    },
  ];

  constructor(public sidebarState: SidebarStateService) {
    this.sidebarState.collapsed$.subscribe((collapsed) => {
      this.visible.set(!collapsed);
    });
  }

  toggleSubmenu(option: SidebarOption) {
    const current = this.submenusOpen.get(option.label) ?? false;
    this.submenusOpen.set(option.label, !current);
  }

  isSubmenuOpen(option: SidebarOption): boolean {
    return this.submenusOpen.get(option.label) ?? false;
  }
}
