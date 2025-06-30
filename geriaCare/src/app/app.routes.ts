import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterUserFormComponent } from './pages/register-user-form/register-user-form.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterElderlyFormComponent } from './pages/register-elderly-form/register-elderly-form.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from './guards/auth.guard';
import { ActivitiesFormComponent } from './pages/activities-form/activities-form.component';
import { EldersListComponent } from './pages/elders-list/elders-list.component';
import { EldersPrescriptionsComponent } from './pages/elders-prescriptions/elders-prescriptions.component';
import { EldersDietComponent } from './pages/elders-diet/elders-diet.component';
import { ActivitiesListComponent } from './pages/activities-list/activities-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'registeruser', component: RegisterUserFormComponent },
  { path: 'loginuser', component: LoginFormComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'registerelder', component: RegisterElderlyFormComponent },
      { path: 'registeractivity', component: ActivitiesFormComponent },
      { path: 'elderlist', component: EldersListComponent },
      { path: 'eldersprescription', component: EldersPrescriptionsComponent },
      { path: 'eldersdiet', component: EldersDietComponent },
      { path: 'activitieslist', component: ActivitiesListComponent },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
