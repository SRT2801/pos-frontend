import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../core/enums/permission.enum';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private allowedPermissions: Permission[] = [];

  @Input() set hasPermission(permissions: Permission[] | Permission) {
    this.allowedPermissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.authService.hasPermission(this.allowedPermissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
