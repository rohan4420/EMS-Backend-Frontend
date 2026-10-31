import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PlaceholderPageComponent } from './features/placeholder-page/placeholder-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: PlaceholderPageComponent,
        data: {
          title: 'Make My Marriage',
          description: 'A thoughtful space for your family to plan and celebrate one wedding.',
          variant: 'landing',
        },
      },
      {
        path: 'login',
        component: PlaceholderPageComponent,
        data: {
          title: 'Welcome back',
          description: 'Organizer sign-in will be added in a later phase.',
        },
      },
      {
        path: 'signup',
        component: PlaceholderPageComponent,
        data: {
          title: 'Create your account',
          description: 'Organizer registration will be added in a later phase.',
        },
      },
      {
        path: 'forgot-password',
        component: PlaceholderPageComponent,
        data: {
          title: 'Reset your password',
          description: 'Password recovery will be added in a later phase.',
        },
      },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: PlaceholderPageComponent,
        data: {
          title: 'Your wedding at a glance',
          description: 'A shared overview for the couple and family organizers.',
        },
      },
      {
        path: 'events',
        component: PlaceholderPageComponent,
        data: {
          title: 'Events',
          description: 'Plan the schedule and details for each celebration.',
        },
      },
      {
        path: 'guests',
        component: PlaceholderPageComponent,
        data: {
          title: 'Guests',
          description: 'Keep guest details and event assignments together.',
        },
      },
      {
        path: 'invitations',
        component: PlaceholderPageComponent,
        data: {
          title: 'Invitations',
          description: 'Prepare invitations and keep delivery status in view.',
        },
      },
      {
        path: 'rsvp',
        component: PlaceholderPageComponent,
        data: {
          title: 'RSVPs',
          description: 'Review guest responses across your wedding events.',
        },
      },
      {
        path: 'expenses',
        component: PlaceholderPageComponent,
        data: {
          title: 'Expenses',
          description: 'Track wedding costs and payment status in one place.',
        },
      },
      {
        path: 'tasks',
        component: PlaceholderPageComponent,
        data: {
          title: 'Tasks',
          description: 'Coordinate responsibilities with your organizers.',
        },
      },
      {
        path: 'calendar',
        component: PlaceholderPageComponent,
        data: {
          title: 'Calendar',
          description: 'See important wedding dates and events together.',
        },
      },
      {
        path: 'gallery',
        component: PlaceholderPageComponent,
        data: {
          title: 'Gallery',
          description: 'A home for event albums and shared memories.',
        },
      },
      {
        path: 'wedding-website',
        component: PlaceholderPageComponent,
        data: {
          title: 'Wedding website',
          description: 'Shape the public details you choose to share.',
        },
      },
      {
        path: 'settings',
        component: PlaceholderPageComponent,
        data: {
          title: 'Settings',
          description: 'Manage your account and application preferences.',
        },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
