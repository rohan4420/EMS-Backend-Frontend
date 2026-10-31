import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBannerComponent } from './shared/components/error-banner/error-banner.component';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';

@Component({
  imports: [ErrorBannerComponent, LoadingIndicatorComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
