import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideBarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  isCollapsed = false;
  isMobileMenuVisible = true;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;

    if (width > 768) {
      // En desktop, forzamos visibilidad del sidebar
      this.isMobileMenuVisible = true;
    } else {
      // En mobile, ocultamos el sidebar por defecto
      this.isMobileMenuVisible = false;
    }
  }

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
