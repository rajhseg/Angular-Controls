import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-load',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './load.component.html',
  styleUrl: './load.component.css'
})
export class LoadComponent {

  private readonly router = inject(Router, { optional: true });
  protected readonly currentUrl = signal<string>('/default');

  constructor(){
    if (this.router) {
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.currentUrl.set(event.urlAfterRedirects || event.url);
        });
    }
  }
  
}
