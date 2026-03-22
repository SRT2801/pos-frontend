import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'secondary'
  | 'contrast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageService = inject(MessageService);

  show(
    severity: ToastSeverity,
    detail: string,
    summary?: string,
    life = 3000,
  ): void {
    this.messageService.add({
      severity,
      summary: summary ?? this.defaultSummary(severity),
      detail,
      life,
    });
  }

  success(detail: string, summary = 'Éxito', life = 3000): void {
    this.show('success', detail, summary, life);
  }

  info(detail: string, summary = 'Información', life = 3000): void {
    this.show('info', detail, summary, life);
  }

  warn(detail: string, summary = 'Aviso', life = 3000): void {
    this.show('warn', detail, summary, life);
  }

  error(detail: string, summary = 'Error', life = 5000): void {
    this.show('error', detail, summary, life);
  }

  private defaultSummary(severity: ToastSeverity): string {
    const map: Record<ToastSeverity, string> = {
      success: 'Éxito',
      info: 'Información',
      warn: 'Aviso',
      error: 'Error',
      secondary: '',
      contrast: '',
    };
    return map[severity];
  }
}
