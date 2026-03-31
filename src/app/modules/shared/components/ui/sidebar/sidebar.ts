import { Component, computed, inject } from '@angular/core';
import { SidebarStateService } from '../../../services/sidebarState.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../../core/enums/role.enum';
import { SidebarOption } from '../interfaces/sidebar-option.interface';
import { ToastService } from '../../../services/toast.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';

@Component({
  selector: 'app-sidebar',
  imports: [AvatarModule, ButtonModule, RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar {
  public authService = inject(AuthService);
  private router = inject(Router);
  public toastService = inject(ToastService);
  public spinner = inject(ProgressSpinnerService);

  submenusOpen = new Map<string, boolean>();

  options: SidebarOption[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      roles: [Role.OWNER, Role.ADMIN, Role.STAFF],
    },
    {
      label: 'Registro',
      icon: 'pi pi-user-plus',
      roles: [Role.OWNER, Role.ADMIN],
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
          label: 'Tus Productos',
          icon: 'pi pi-list',
          route: '/products',
        },
        {
          label: 'Agregar Productos',
          icon: 'pi pi-plus',
          route: 'products/create',
          roles: [Role.OWNER, Role.ADMIN],
        },
      ],
    },
  ];

  constructor(public sidebarState: SidebarStateService) {}

  visibleOptions = computed(() => {
    return this.options
      .map((option) => {
        const node = { ...option };

        if (node.children) {
          node.children = node.children.filter((child) => {
            if (!child.roles) return true; // Pública
            return this.authService.hasRole(child.roles);
          });
        }
        return node;
      })
      .filter((option) => {
        if (option.roles && !this.authService.hasRole(option.roles)) {
          return false;
        }

        if (option.children !== undefined && option.children.length === 0) {
          return false;
        }

        return true;
      });
  });

  toggleSubmenu(option: SidebarOption) {
    const current = this.submenusOpen.get(option.label) ?? false;
    this.submenusOpen.set(option.label, !current);
  }

  isSubmenuOpen(option: SidebarOption): boolean {
    return this.submenusOpen.get(option.label) ?? false;
  }

  onLogout() {
    this.spinner.show();
    this.authService.logout().subscribe({
      next: () => {
        this.spinner.hide();
        this.toastService.success('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.spinner.hide();
        this.toastService.error(err.error?.message || 'Logout failed');
      },
    });
  }
}
