import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Employee } from '../models/employee.interface';
import { EmployeeAdd } from '../models/employee-add.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = environment.baseUrl + 'Employee/';

  private _httpClient = inject(HttpClient);

  addEmployee(addPayload: EmployeeAdd): Observable<Employee> {
    return this._httpClient.post<Employee>(this.apiUrl, addPayload);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this._httpClient.get<Employee[]>(this.apiUrl);
  }

  deleteEmployee(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
