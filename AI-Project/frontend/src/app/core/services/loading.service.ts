import { computed, Injectable, signal } from '@angular/core';
import { defer, finalize, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = signal(0);
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  track<T>(request: Observable<T>): Observable<T> {
    return defer(() => {
      this.pendingRequests.update((count) => count + 1);
      return request.pipe(finalize(() => this.pendingRequests.update((count) => count - 1)));
    });
  }
}
