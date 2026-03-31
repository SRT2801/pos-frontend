import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../../core/enums/role.enum';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private allowedRoles: Role[] = [];

  @Input() set hasRole(roles: Role[] | Role) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.authService.hasRole(this.allowedRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
