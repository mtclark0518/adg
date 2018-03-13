import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { LandingModule } from './components/landing/landing.module';
import { UserService } from './shared/user.service';
import { AuthGuard } from './shared/auth.guard';
import { ReportService } from './shared/report.service';
import { IdentityService } from './shared/identity.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [

    AngularFontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    LandingModule,
    AgmCoreModule.forRoot({
      apiKey:  'AIzaSyBgQmedO9VcwFfMzMMiYZIbP4_7OvE5VoI'
    })
  ],
  providers: [ UserService, ReportService, IdentityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
