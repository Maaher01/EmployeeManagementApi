import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[];
  errorResponse: any;
  displayedColumns: string[] = [
    'id',
    'image',
    'name',
    'departmentName',
    'dateOfJoining',
    'action',
  ];
  dataSource: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.dataSource = this.employees;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }
}
