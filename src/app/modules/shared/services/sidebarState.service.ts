import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private collapsedSubject = new BehaviorSubject<boolean>(true);
  collapsed$ = this.collapsedSubject.asObservable();

  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  get collapsed() {
    return this.collapsedSubject.value;
  }

  close() {
    this.collapsedSubject.next(true);
  }

  open() {
    this.collapsedSubject.next(false);
  }
}
