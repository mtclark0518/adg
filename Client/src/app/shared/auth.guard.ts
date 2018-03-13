import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IdentityService } from './identity.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private identity: IdentityService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('authguard says: ')
      console.log(this.identity.loggedIn());
      // if (!this.token.loggedIn()) {
      //   const path = `/welcome`;
      //   this.token.clearToken();
      //   this.router.navigateByUrl(path);
      //   console.log('block');
      // }
      return true;
    }
}
