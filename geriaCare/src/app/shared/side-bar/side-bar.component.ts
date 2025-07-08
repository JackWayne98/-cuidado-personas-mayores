import { Component, Output, EventEmitter, Input, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Iuser } from "../../interfaces/iuser";
import { signal, effect } from "@angular/core";

@Component({
  selector: "app-side-bar",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./side-bar.component.html",
  styleUrl: "./side-bar.component.css",
})
export class SideBarComponent {
  router = inject(Router);
  private authService = inject(AuthService);

  @Input() isCollapsed = false;
  @Input() isMobileMenuVisible = true;
  @Output() sectionChange = new EventEmitter<string>();
  @Output() toggleSidebarRequest = new EventEmitter<void>();

  activeSection = "dashboard";

  user = signal<Iuser | null>(null);

  constructor() {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      this.authService.getUserById(+userId).then((res) => {
        this.user.set(res.user);
      });
    }
  }

  toggleSidebar() {
    this.toggleSidebarRequest.emit();
  }

  setActive(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/home";
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
