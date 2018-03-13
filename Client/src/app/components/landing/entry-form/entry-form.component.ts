import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { User } from '../../../models/user';
import { allValidators } from '../../../shared/validators';
import { UserService } from '../../../shared/user.service';
import { IdentityService } from '../../../shared/identity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
})
export class EntryFormComponent implements OnInit {
  @Input('type') type: string;
  entryForm;
  user: User = {
    email: null,
    password: null
  };
  constructor( private entry: UserService, private identity: IdentityService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.type);
    this.entryForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required,
        allValidators(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ]),
    });
  }

  get password() { return this.entryForm.get('password'); }
  get email() { return this.entryForm.get('email'); }

  submit(): void {
    this.type === 'login' ? this.login() : this.register();
  }

  login(): void {
    this.entry.login(this.email.value, this.password.value).subscribe(response => {
      this.identity.setToken(response);
      this.router.navigateByUrl(`/dash/${this.identity.getProfile().sub}`);
    });
  }
  register(): void {
    this.entry.register(this.email.value, this.password.value).subscribe(response => {
      this.identity.setToken(response);
      this.router.navigateByUrl(`/dash/new/account`);
    });
  }
}
