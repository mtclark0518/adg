import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { IdentityService } from './identity.service';

export interface IAuthResponse { token: string; }

@Injectable()
export class UserService {
  domain = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private identity: IdentityService) {
  }

  login(username, password) {
    return this.http.post(`${this.domain}/user/login`, {username, password}, this.identity.basic);
  }
  register(username, password) {
    return this.http.post(`${this.domain}/user/register`, {username, password}, this.identity.basic);
  }
  signout() {
    this.identity.clearToken();
    this.http.post(`${this.domain}/user/signout`, {}, this.identity.authHeaders);
  }

}
