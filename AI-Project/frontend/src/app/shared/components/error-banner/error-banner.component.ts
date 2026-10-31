import { Component, inject } from '@angular/core';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-error-banner',
  template: `
    @if (errors.message(); as message) {
      <div class="error-banner" role="alert">
        <p>{{ message }}</p>
        <button type="button" aria-label="Dismiss error" (click)="errors.clear()">Dismiss</button>
      </div>
    }
  `,
  styles: `
    .error-banner {
      position: fixed;
      z-index: 30;
      top: 1rem;
      right: 1rem;
      left: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      max-width: 52rem;
      margin-inline: auto;
      padding: 0.8rem 1rem;
      border: 1px solid #e8c9cd;
      border-radius: 0.8rem;
      background: #fff7f6;
      box-shadow: var(--shadow-card);
      color: #7d293b;
    }

    p {
      margin: 0;
      line-height: 1.5;
    }

    button {
      flex: 0 0 auto;
      padding: 0.35rem 0.55rem;
      border: 0;
      border-radius: 0.4rem;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    button:hover {
      background: #f3e8e9;
    }
  `,
})
export class ErrorBannerComponent {
  protected readonly errors = inject(ErrorHandlerService);
}
