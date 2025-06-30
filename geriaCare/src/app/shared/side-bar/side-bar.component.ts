import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() isOpen = false;
  @Output() sectionChange = new EventEmitter<string>();

  isCollapsed = false;
  activeSection = 'dashboard';

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
}
