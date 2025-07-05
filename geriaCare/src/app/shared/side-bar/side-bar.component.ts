import { Component, Output, EventEmitter, Input, inject, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  router = inject(Router);

  @Input() isCollapsed = false;
  @Input() isMobileMenuVisible = true;
  @Output() sectionChange = new EventEmitter<string>();
  @Output() toggleSidebarRequest = new EventEmitter<void>();

  activeSection = 'dashboard';

  toggleSidebar() {
    this.toggleSidebarRequest.emit();
  }

  setActive(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
