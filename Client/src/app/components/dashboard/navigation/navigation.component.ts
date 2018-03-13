import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../shared/user.service';
import { IdentityService } from '../../../shared/identity.service';
import { Router } from '@angular/router';
import { Profile } from '../../../models/profile';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../dashboard.component.css']
})
export class NavigationComponent implements OnInit {

  domain = 'http://localhost:5000';
  currentUser;
  details: Profile;


  constructor(
    private http: HttpClient,
    private user: UserService,
    private identity: IdentityService,
    private router: Router) { }

  ngOnInit() {
    this.currentUser = this.identity.getProfile().nameid;
    this.getUserDetails();
  }

  getUserDetails() {
    return this.http.get<Profile>(`${this.domain}/api/reports/${this.currentUser}`)
      .subscribe( response => {
        this.details = {...response};
      });
  }

  toProfileUpdate() {
    const path = `/dash/${this.identity.getProfile().sub}/update`;
    this.router.navigateByUrl(path);
  }

  signout() {
    this.user.signout();
    this.router.navigateByUrl('/');
  }
}
