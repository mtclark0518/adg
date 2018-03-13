import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import * as decode from 'jwt-decode';
@Injectable()
export class IdentityService {

  constructor() { }

  // Setting up basic headers
  public basic = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  };

  // Setting Authorization header
  // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
  private AuthBearer = `Bearer ${this.getToken()}`;
  public authHeaders =  {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': this.AuthBearer
    })
  };
  public loggedIn() {
    const token = this.getToken();
    console.log(token);
    return !!token && !this.isTokenExpired(token);
  }

  public isTokenExpired(token) {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
  }

  public setToken(token) {
      // Saves user token to localStorage
      localStorage.setItem('token', token);
  }

  public getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('token');
  }

  public clearToken() {
      // Clear user token and profile data from localStorage
      localStorage.removeItem('token');
  }

  public getProfile() {
      // Using jwt-decode npm package to decode the token
      return decode(this.getToken());
  }
}
