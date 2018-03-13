import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/identity.service';
import { Profile } from '../../../models/profile';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['../dashboard.component.css']
})
export class UpdateProfileComponent implements OnInit {

  firstName: string;
  lastName: string;
  userHandle: string;
  domain = 'http://localhost:5000';
  constructor(
      private identity: IdentityService,
      private http: HttpClient,
      private router: Router
    ) { }

  ngOnInit() {
    this.userHandle = this.identity.getProfile().sub;
  }


  handleSubmit(): void {
    const profile: Profile = {
      id: this.identity.getProfile().id,
      firstName: this.firstName,
      lastName: this.lastName,
      userHandle: this.userHandle,
      identityId: this.identity.getProfile().nameid
    };
    this.http
      .put(`${this.domain}/api/doodoo/update/` + profile.identityId, profile, this.identity.basic)
        .subscribe(response => {
          if (response) {
            this.router.navigateByUrl(`/dash/${profile.userHandle}`);
          }
      });
  }
}
