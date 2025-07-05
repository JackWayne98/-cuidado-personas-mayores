import { Component } from "@angular/core";
import { LandingFooterComponent } from "../../shared/landing-footer/landing-footer.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-about-us",
  imports: [LandingFooterComponent, RouterModule],
  templateUrl: "./about-us.component.html",
  styleUrl: "./about-us.component.css",
})
export class AboutUsComponent {}
