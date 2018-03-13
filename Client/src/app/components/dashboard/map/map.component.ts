import { Component, OnInit } from '@angular/core';
import { ReportMarker } from '../../../models/report-marker';
import { ReportService } from '../../../shared/report.service';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators/map';
import { Marker } from '@agm/core/services/google-maps-types';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['../dashboard.component.css']
})

export class MapComponent implements OnInit {
  markers: Array<ReportMarker>;
  // map coordinates
  lat: number;
  lng: number;
  zoom: number;
  ip;
  constructor(
    private report: ReportService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.ipLocate();
    this.report.currentMapMarkers.subscribe(markers =>  this.markers = markers);
  }


  ipLocate() {
    return this.http.get('http://ip-api.com/json')
      .subscribe(response => {
        this.ip = {...response };
        this.lat = this.ip.lat;
        this.lng = this.ip.lon;
        this.zoom = 11;
      });
  }

}
