import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ReportingComponent } from './reporting/reporting.component';
import { MapComponent } from './map/map.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FilterComponent } from './filter/filter.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    ReportingComponent,
    MapComponent,
    NavigationComponent,
    FilterComponent,
    UpdateProfileComponent,
    DashboardComponent
  ]
})
export class DashboardModule { }
