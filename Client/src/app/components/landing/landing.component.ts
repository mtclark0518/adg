import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../shared/identity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  type;
  handle;
  login = false;
  register = false;

  constructor( private identity: IdentityService, private router: Router) { }

  ngOnInit() {
    this.welcomeBack();
  }

  welcomeBack(): boolean {
    if (this.identity.loggedIn()) {
      this.handle = this.identity.getProfile().sub;
      this.router.navigateByUrl(`/dash/${this.handle}`);
      return true;
    }
    this.identity.clearToken();
  }
  set(type) {
    this.type = type;
    console.log(type === 'login');
    type === 'login' ? this.login = true : this.register = true;
  }
  goBack() {
    this.login = false;
    this. register = false;
  }
}
