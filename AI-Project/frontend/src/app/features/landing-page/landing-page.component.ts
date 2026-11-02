import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly activeSection = signal('home');

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      const sections = root.querySelectorAll<HTMLElement>(
        '#home, #features, #how-it-works, #about-us',
      );
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const current = visibleSections[0]?.target.id;
          if (current) this.activeSection.set(current);
        },
        { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.15, 0.4, 0.7] },
      );

      sections.forEach((section) => observer.observe(section));
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected readonly features = [
    { icon: 'space_dashboard', title: 'Wedding dashboard', description: 'See important wedding activities and progress at a glance.' },
    { icon: 'event', title: 'Event management', description: 'Organize traditional and custom celebrations in one schedule.' },
    { icon: 'groups', title: 'Guest management', description: 'Keep guest details, families and event invitations together.' },
    { icon: 'mail', title: 'Digital invitations', description: 'Share thoughtful invitations with the people you love.' },
    { icon: 'mark_email_read', title: 'RSVP management', description: 'Track responses for each event, including link-based guest RSVPs.' },
    { icon: 'account_balance_wallet', title: 'Wedding budget', description: 'Keep wedding expenses organized in one shared view.' },
    { icon: 'checklist', title: 'Tasks & collaboration', description: 'Coordinate responsibilities with your family organizers.' },
    { icon: 'calendar_month', title: 'Shared calendar', description: 'Keep everyone aligned on wedding dates and schedules.' },
    { icon: 'photo_library', title: 'Photo gallery', description: 'Organize celebration memories event by event.' },
    { icon: 'language', title: 'Wedding website', description: 'Share event details, maps, photos and RSVP information.' },
  ];

  protected readonly steps = [
    { number: '01', title: 'Create your wedding workspace', description: 'Set up your one shared celebration space and invite your family organizers.' },
    { number: '02', title: 'Plan together', description: 'Bring events, guests, invitations, tasks and schedules together.' },
    { number: '03', title: 'Celebrate without the chaos', description: 'Share useful details with guests and stay aligned as a family.' },
  ];

  protected readonly gallery = [
    { src: '/images/pre-wedding.jpg', alt: 'A couple sharing a joyful moment in traditional wedding attire', caption: 'A moment together', className: 'memory-card--portrait' },
    { src: '/images/lake-palace.jpg', alt: 'A lakeside palace framed by detailed Rajasthani architecture', caption: 'The celebration setting', className: 'memory-card--palace' },
    { src: '/images/wedding-stationery.jpg', alt: 'Wedding stationery prepared for a family celebration', caption: 'The little details', className: 'memory-card--details' },
  ];

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected navigateToSection(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    this.closeMobileMenu();
    this.activeSection.set(sectionId);
    const section = this.document.getElementById(sectionId);
    if (!section) return;

    const reducedMotion = this.document.defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}
