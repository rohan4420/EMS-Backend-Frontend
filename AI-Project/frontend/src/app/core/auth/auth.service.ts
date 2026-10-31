import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal(false);

  isAuthenticated(): boolean {
    return this.authenticated();
  }
}
