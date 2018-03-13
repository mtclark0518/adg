import { Component, OnInit } from '@angular/core';
import { FilterQuery } from '../../../models/filter-query';
import { color, smell, texture } from '../../../models/report';
import { IdentityService } from '../../../shared/identity.service';
import { ReportService } from '../../../shared/report.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['../dashboard.component.css']
})

export class FilterComponent implements OnInit {

  filtering: string;
  colors: string[];
  smells: string[];
  textures: string[];
  bySmell = false;
  byTexture = false;
  radios: boolean;
  colorfilter: string[] = [];
  smellfilter: string[] = [];
  texturefilter: string[] = [];
  profile;
  filter: FilterQuery;

  constructor(
    private report: ReportService) { }

  ngOnInit() {
    this.setFilterOptions();
    this.report.currentFilterState.subscribe( filter => this.filter = filter );
    this.report.getUserDetails().subscribe( response => this.profile = {...response} );

  }

  pushColor(e) {
    if (e.target.checked) {
      this.colorfilter.push(e.target.value);
    }
    if (!e.target.checked) {
      this.colorfilter = this.colorfilter.filter(colors => colors !== e.target.value);
    }
    console.log(this.colorfilter);
  }

  pushSmell(e) {
    if (e.target.checked) {
      this.smellfilter.push(e.target.value);
    }
    if (!e.target.checked) {
      this.smellfilter = this.smellfilter.filter(smells => smells !== e.target.value);
    }
    console.log(this.smellfilter);
  }

  pushTexture(e) {
    if (e.target.checked) {
      this.texturefilter.push(e.target.value);
    }
    if (!e.target.checked) {
      this.texturefilter = this.texturefilter.filter(textures => textures !== e.target.value);
    }
    console.log(this.texturefilter);
  }

  toggleFiltering(by) {
    if (by === 'color') { this.filtering = 'color'; }
    if (by === 'smell') { this.filtering = 'smell'; }
    if (by === 'texture') { this.filtering = 'texture'; }
  }

  setFilterOptions() {
    const ckeys = Object.keys(color), skeys = Object.keys(smell), tkeys = Object.keys(texture);
    this.colors =  ckeys.slice(ckeys.length / 2),
    this.smells = skeys.slice(skeys.length / 2),
    this.textures = tkeys.slice(tkeys.length / 2);
  }

  newFilter() {
    console.log(this.radios);
    console.log(typeof(this.radios));
    const settings: FilterQuery = {
      filtered: this.radios,
      requester: this.profile.userProfileId,
      byColor: this.colorfilter.length > 0 ? true : false,
      bySmell: this.smellfilter.length > 0 ? true : false,
      byTexture: this.texturefilter.length > 0 ? true : false,
      ColorFilter: this.colorfilter,
      SmellFilter: this.smellfilter,
      TextureFilter: this.texturefilter,
    };
    console.log(settings);
    console.log(typeof((settings.filtered)));
    this.report.changeFilterState(settings);
  }
}
