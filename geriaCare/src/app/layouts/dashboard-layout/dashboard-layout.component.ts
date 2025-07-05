import { Component } from '@angular/core';
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

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
