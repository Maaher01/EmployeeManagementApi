import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AttendanceSetting } from '../models/attendance-setting';
import { AttendanceSettingAdd } from '../models/attendance-setting-add';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  apiUrl = environment.baseUrl + 'Attendance';

  private _httpClient = inject(HttpClient);

  addAttendanceSetting(
    addPayload: AttendanceSettingAdd,
  ): Observable<AttendanceSetting> {
    return this._httpClient.post<AttendanceSetting>(
      this.apiUrl + '/settings',
      addPayload,
    );
  }

  getAttendanceSettings(): Observable<AttendanceSetting[]> {
    return this._httpClient.get<AttendanceSetting[]>(this.apiUrl + '/settings');
  }
}
