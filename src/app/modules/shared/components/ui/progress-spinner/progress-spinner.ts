import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-progress-spinner',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <p-progress-spinner strokeWidth="8" fill="transparent" animationDuration=".5s"
        [style]="{ width: '50px', height: '50px' }"></p-progress-spinner>
    </div>
  `,
  standalone: true,
  imports: [ProgressSpinnerModule]
})
export class AppProgressSpinner {}
