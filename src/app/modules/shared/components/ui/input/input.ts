import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  template: `
    <div class="relative">
      <ng-container *ngIf="icon">
        <i
          class="pi"
          [ngClass]="icon + ' absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg'"
        ></i>
      </ng-container>
      <ng-content select="i[slot=icon]"></ng-content>
      <input
        [id]="id"
        [type]="type"
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
export class InputComponent {
  @Input() id = '';
  @Input() type: string = 'text';
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
    'w-full pl-10 pr-4 py-3 bg-surface-container-low border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary transition-all duration-200 outline-none ';
  @Input() model = signal<string>('');
  @Input() icon?: string;
}
