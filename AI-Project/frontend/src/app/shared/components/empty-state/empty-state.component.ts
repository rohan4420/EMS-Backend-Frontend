import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty-state" aria-live="polite">
      <span class="empty-state__mark" aria-hidden="true"></span>
      <h2>{{ title() }}</h2>
      <p>{{ description() }}</p>
    </section>
  `,
  styles: `
    .empty-state {
      display: grid;
      justify-items: center;
      gap: 0.65rem;
      padding: clamp(2rem, 7vw, 4.5rem) 1.5rem;
      border: 1px solid var(--color-line);
      border-radius: 1.2rem;
      background: rgb(255 255 255 / 82%);
      text-align: center;
    }

    .empty-state__mark {
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.35rem;
      border: 1px solid #d6bdc3;
      border-radius: 50%;
      background: radial-gradient(circle, #6e203b 0 3px, transparent 4px);
    }

    h2 {
      margin: 0;
      color: var(--color-ink);
      font:
        500 1.4rem/1.3 Georgia,
        serif;
    }

    p {
      max-width: 34rem;
      margin: 0;
      color: var(--color-muted);
      line-height: 1.7;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
