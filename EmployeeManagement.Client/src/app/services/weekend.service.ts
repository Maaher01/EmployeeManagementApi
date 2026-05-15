import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Weekend } from '../models/weekend.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeekendService {
  apiUrl = environment.baseUrl + 'Weekend/';

  private _httpClient = inject(HttpClient);

  getAllWeekends(): Observable<Weekend[]> {
    return this._httpClient.get<Weekend[]>(this.apiUrl);
  }

  setWeekend(editPayload: any) {
    return this._httpClient.post(this.apiUrl, editPayload);
  }
}
