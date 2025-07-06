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
  isMobileMenuVisible = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // En móvil: ocultamos el menú y aseguramos que NO esté colapsado
      this.isMobileMenuVisible = false;
      this.isCollapsed = false;
    } else {
      // En escritorio: visible y puede colapsarse
      this.isMobileMenuVisible = true;
      this.isCollapsed = false;
    }
  }

  toggleSidebar() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
      this.isCollapsed = false;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
