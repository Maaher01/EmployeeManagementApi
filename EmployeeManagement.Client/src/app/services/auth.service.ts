import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../models/decoded-token.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.baseUrl + 'Auth/';

  private _httpClient = inject(HttpClient);
  private _router = inject(Router);

  login(userCred: any): Observable<any> {
    return this._httpClient.post(this.apiUrl + 'login', userCred);
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  getUserInfo(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode(token);
  }
}
