import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-placeholder-page',
  imports: [EmptyStateComponent, RouterLink],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  protected readonly page = computed(() => {
    const data = this.routeData();
    const title = data['title'];
    const description = data['description'];
    const variant = data['variant'];

    return {
      title: typeof title === 'string' ? title : 'Make My Marriage',
      description:
        typeof description === 'string'
          ? description
          : 'This part of the application is being prepared.',
      isLanding: variant === 'landing',
    };
  });
}
