import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-input',
  template: `
    <div class="relative flex items-center">
      <ng-container *ngIf="icon">
        <i
          class="pi"
          [ngClass]="icon + ' absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg'"
        ></i>
      </ng-container>
      <ng-content select="i[slot=icon]"></ng-content>
      <input
        [id]="id"
        [type]="show() ? 'text' : 'password'"
        [placeholder]="placeholder"
        [name]="name"
        [class]="inputClass"
        [attr.aria-label]="ariaLabel"
        [attr.required]="required ? '' : null"
        [ngModel]="model()"
        (ngModelChange)="model.set($event)"
        [attr.autocomplete]="autocomplete"
        [attr.disabled]="disabled ? '' : null"
        [attr.maxlength]="maxlength"
        [attr.minlength]="minlength"
        [attr.pattern]="pattern"
        [attr.autofocus]="autofocus ? '' : null"
        [attr.readonly]="readonly ? '' : null"
      />
      <button
        class="absolute right-2 flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
        type="button"
        (click)="toggle()"
        [attr.aria-label]="show() ? 'Ocultar contraseña' : 'Ver contraseña'"
      >
        <i class="pi" [ngClass]="show() ? 'pi-eye-slash' : 'pi-eye'"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PasswordInputComponent {
  @Input() id = '';
  @Input() placeholder = '';
  @Input() name = '';
  @Input() ariaLabel = '';
  @Input() required = false;
  @Input() autocomplete?: string;
  @Input() disabled = false;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() pattern?: string;
  @Input() autofocus = false;
  @Input() readonly = false;
  @Input() inputClass =
    'form-input h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 focus:outline-none sm:h-14 sm:pr-12';
  @Input() model = signal<string>('');
  @Input() icon?: string;
  show = signal(false);
  toggle() {
    this.show.update((v) => !v);
  }
}
