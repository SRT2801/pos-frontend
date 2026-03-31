import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressSpinnerService {
  private _visible = signal(false);

  show() { this._visible.set(true); }
  hide() { this._visible.set(false); }
  get visible() { return this._visible.asReadonly(); }
}
