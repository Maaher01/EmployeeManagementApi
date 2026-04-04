import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Department } from 'src/app/models/department.interface';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments: Department[];
  errorResponse: any;
  displayedColumns: string[] = ['name', 'action'];
  dataSource: any;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.getAllDepartments();
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.dataSource = this.departments;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }
}
