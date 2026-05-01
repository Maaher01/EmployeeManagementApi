import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Attendance } from '../models/attendance';
import { AttendanceAdd } from '../models/attendance-add';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  apiUrl = environment.baseUrl + 'Attendance/';

  private _httpClient = inject(HttpClient);

  getAttendanceByDate(date: string): Observable<Attendance[]> {
    return this._httpClient.get<Attendance[]>(this.apiUrl, {
      params: { date: date },
    });
  }

  markAttendance(addPayload: AttendanceAdd): Observable<Attendance> {
    return this._httpClient.post<Attendance>(this.apiUrl, addPayload);
  }
}
