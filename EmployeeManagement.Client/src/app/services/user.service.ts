import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.baseUrl + 'User/';

  private _httpClient = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this._httpClient.get<User[]>(this.apiUrl);
  }
}
