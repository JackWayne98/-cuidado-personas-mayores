import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { LandingFooterComponent } from "../../shared/landing-footer/landing-footer.component";

@Component({
  selector: "app-home",
  imports: [RouterLink, LandingFooterComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  router = inject(Router);
  //Redirige al dashboard si el usuario se encuentra loggeado
  checkToken = (() => {
    const token = localStorage.getItem("token");
    if (token) {
      this.router.navigate(["/dashboard"]);
    }
  })();
}
