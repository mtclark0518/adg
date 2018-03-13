import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../models/profile';
import { color, smell, texture } from '../../../models/report';
import { ReportService } from '../../../shared/report.service';
import { IdentityService } from '../../../shared/identity.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['../dashboard.component.css']
})
export class ReportingComponent implements OnInit {
  colors: string[];
  smells: string[];
  textures: string[];

  isReporting = false;
  lat: number;
  lng: number;
  smell = 'Smell';
  color = 'Color';
  texture = 'Texture';
  zoom = 8;
  locating = false;

  constructor( private report: ReportService, private identity: IdentityService) { }

  ngOnInit() {
    const ckeys = Object.keys(color), skeys = Object.keys(smell), tkeys = Object.keys(texture);
    this.colors =  ckeys.slice(ckeys.length / 2),
    this.smells = skeys.slice(skeys.length / 2),
    this.textures = tkeys.slice(tkeys.length / 2);
  }

  useMyLocation() {
    this.locating = true;
    const success = (pos) => {
      const loc = pos.coords;
      this.lat = loc.latitude;
      this.lng = loc.longitude;
      this.zoom = 17;
      this.locating = false;
    };
    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      this.locating = false;
    };
    navigator.geolocation.getCurrentPosition(success, error);
  }

createReport() {
  this.report.createNewReport({
    Latitude: this.lat,
    Longitude: this.lng,
    Texture: this.texture,
    Color: this.color,
    Smell: this.smell,
  })
  .subscribe(response => {
    console.log(response);
    console.log('done');
  });
  this.toggleReporting();
}

  toggleReporting() {
    if (!this.isReporting) {
      this.isReporting = true;
    } else {
      this.isReporting = false ;
    }
  }
}
