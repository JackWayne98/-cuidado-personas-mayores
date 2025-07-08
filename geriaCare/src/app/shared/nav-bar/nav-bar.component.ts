import { Component, inject } from "@angular/core";
import { RouterLink, Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-nav-bar",
  imports: [RouterLink],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.css",
})
export class NavBarComponent {
  router = inject(Router);
  //checa si existe un login token
  get isLogged(): boolean {
    return !!localStorage.getItem("token");
  }
  //funcion para logout del usuario
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/home";
  }
}
