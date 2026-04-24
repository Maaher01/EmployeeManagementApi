import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.interface';
import { UserAdd } from '../models/user-add.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.baseUrl + 'User/';

  private _httpClient = inject(HttpClient);

  addUser(addPayload: UserAdd): Observable<User> {
    return this._httpClient.post<User>(this.apiUrl, addPayload);
  }

  getAllUsers(): Observable<User[]> {
    return this._httpClient.get<User[]>(this.apiUrl);
  }

  deleteUser(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
