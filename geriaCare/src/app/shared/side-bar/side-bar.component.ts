import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  @Input() isOpen = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() activeItemChange = new EventEmitter<string>();

  activeItem = 'dashboard';

  setActive(item: string): void {
    this.activeItem = item;
    this.activeItemChange.emit(item);

    if (window.innerWidth < 768) {
      this.closeSidebar();
    }
  }

  closeSidebar(): void {
    this.sidebarToggle.emit();
  }
}
