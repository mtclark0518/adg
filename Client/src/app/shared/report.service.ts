import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from './identity.service';
import { Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FilterQuery } from '../models/filter-query';
import { ReportMarker } from '../models/report-marker';
import { Report } from '../models/report';

@Injectable()
export class ReportService {

  private domain = 'http://localhost:5000/api';
  private mapMarkerSource = new BehaviorSubject<ReportMarker[]>([]);
  private mapFilterSource = new BehaviorSubject<FilterQuery>({
    filtered: false,
    requester: null,
    byColor: false,
    byTexture: false,
    bySmell: false,
    ColorFilter: [],
    SmellFilter: [],
    TextureFilter: []
  });
  public currentMapMarkers = this.mapMarkerSource.asObservable();
  public currentFilterState = this.mapFilterSource.asObservable();
  private accountId = this.identity.getProfile().nameid;
  filterResponse;


  constructor(
    private http: HttpClient,
    private identity: IdentityService) { }


  updateMarkers(filter: FilterQuery) {
    this.http.post<ReportMarker[]>(`${this.domain}/reports/filter`, filter, this.identity.authHeaders)
      .subscribe( response => {
        console.log(response)
        this.mapMarkerSource.next(response);
      });
  }

  changeFilterState(filter: FilterQuery) {
    console.log(filter);
    this.mapFilterSource.next(filter);
    this.updateMarkers(filter);
  }

  getUserDetails() {
    return this.http.get(`${this.domain}/reports/${this.accountId}`, this.identity.authHeaders);
  }

  createNewReport(doodoo) {
    return this.http.post<Report>(`${this.domain}/reports/${this.accountId}`, doodoo, this.identity.authHeaders);
  }


}
