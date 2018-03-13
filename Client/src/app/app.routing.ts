import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UpdateProfileComponent } from './components/dashboard/update-profile/update-profile.component';

import { AuthGuard } from './shared/auth.guard';


const routes: Routes = [
  {path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'welcome', component: LandingComponent },
  { path: 'dash',
    canActivate: [AuthGuard],
    children: [
      { path: 'new/account', component: UpdateProfileComponent},
      { path: ':handle', component: DashboardComponent},
      { path: ':handle/update', component: UpdateProfileComponent},
    ]
  },
  { path: '**', pathMatch: 'full', component: LandingComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [ AuthGuard ]
})
export class AppRoutingModule { }
