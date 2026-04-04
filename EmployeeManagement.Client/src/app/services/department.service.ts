import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Department } from '../models/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  apiUrl = environment.baseUrl + 'Department/';

  private _httpClient = inject(HttpClient);

  addDepartment(addPayload: Department): Observable<Department> {
    return this._httpClient.post<Department>(this.apiUrl, addPayload);
  }

  getAllDepartments(): Observable<Department[]> {
    return this._httpClient.get<Department[]>(this.apiUrl);
  }

  deleteDepartment(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
