import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  readonly message = signal<string | null>(null);

  report(message: string): void {
    this.message.set(message);
  }

  clear(): void {
    this.message.set(null);
  }
}
