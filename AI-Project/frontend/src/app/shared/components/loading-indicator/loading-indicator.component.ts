import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-indicator',
  template: `
    @if (loading.isLoading()) {
      <div class="loading-indicator" role="status" aria-live="polite">
        <span class="loading-indicator__spinner" aria-hidden="true"></span>
        <span>Loading</span>
      </div>
    }
  `,
  styles: `
    .loading-indicator {
      position: fixed;
      z-index: 20;
      top: 1rem;
      left: 50%;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.7rem 1rem;
      transform: translateX(-50%);
      border: 1px solid var(--color-line);
      border-radius: 999px;
      background: var(--color-surface);
      box-shadow: var(--shadow-card);
      color: var(--color-ink);
      font-size: 0.85rem;
    }

    .loading-indicator__spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid #eadfe2;
      border-top-color: var(--color-burgundy);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .loading-indicator__spinner {
        animation-duration: 2s;
      }
    }
  `,
})
export class LoadingIndicatorComponent {
  protected readonly loading = inject(LoadingService);
}
