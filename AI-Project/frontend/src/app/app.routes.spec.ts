import { authGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { routes } from './app.routes';

describe('application routes', () => {
  const landingRoute = routes.find((route) => route.component === LandingPageComponent);
  const publicRoute = routes.find((route) => route.component === PublicLayoutComponent);
  const organizerRoute = routes.find((route) => route.component === DashboardLayoutComponent);

  it('uses the Stitch landing page for the public home route', () => {
    expect(landingRoute?.path).toBe('');
    expect(landingRoute?.pathMatch).toBe('full');
  });

  it('defines the existing authentication routes', () => {
    const paths = publicRoute?.children?.map((route) => route.path).sort();

    expect(paths).toEqual(['forgot-password', 'login', 'signup']);
  });

  it('defines all organizer routes behind the auth guard', () => {
    const paths = organizerRoute?.children?.map((route) => route.path).sort();

    expect(paths).toEqual([
      'calendar',
      'dashboard',
      'events',
      'expenses',
      'gallery',
      'guests',
      'invitations',
      'rsvp',
      'settings',
      'tasks',
      'wedding-website',
    ]);
    expect(organizerRoute?.canActivateChild).toContain(authGuard);
  });
});
