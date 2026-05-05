import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { AttendanceSetting } from '../models/attendance-setting';
import { AttendanceSettingAdd } from '../models/attendance-setting-add';

@Injectable({
  providedIn: 'root',
})
export class AttendanceSettingService {
  apiUrl = environment.baseUrl + 'AttendanceSettings/';

  private _httpClient = inject(HttpClient);

  addAttendanceSetting(
    addPayload: AttendanceSettingAdd,
  ): Observable<AttendanceSetting> {
    return this._httpClient.post<AttendanceSetting>(this.apiUrl, addPayload);
  }

  getAttendanceSettings(): Observable<AttendanceSetting[]> {
    return this._httpClient.get<AttendanceSetting[]>(this.apiUrl);
  }

  editAttendanceSetting(id: number, editPayload: any) {
    return this._httpClient.put(this.apiUrl + `${id}`, editPayload);
  }
}
