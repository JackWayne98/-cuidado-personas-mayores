import { Component, inject } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { LandingFooterComponent } from "../../shared/landing-footer/landing-footer.component";

@Component({
  selector: "app-home",
  imports: [LandingFooterComponent, RouterLink],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  router = inject(Router);

  checkToken = (() => {
    const token = localStorage.getItem("token");
    if (token) {
      this.router.navigate(["/dashboard"]);
    }
  })();
}
