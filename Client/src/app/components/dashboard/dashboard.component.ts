import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  type: string;
  constructor() { }

  ngOnInit() {
    this.type = 'seeking';
  }
  setType(type) {
    this.type = type;
  }
}
