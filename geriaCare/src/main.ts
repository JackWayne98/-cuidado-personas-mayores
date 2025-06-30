import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SideBarComponent } from './app/shared/side-bar/side-bar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: ``,
})
export class App {
  activeSection = 'dashboard';

  onSectionChange(section: string) {
    this.activeSection = section;
  }
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
