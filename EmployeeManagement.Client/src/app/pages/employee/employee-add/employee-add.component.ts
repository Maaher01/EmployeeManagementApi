import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/models/department.interface';
import { DepartmentService } from 'src/app/services/department.service';
import {
  fileSizeValidator,
  fileTypeValidator,
} from 'src/app/shared/validators/file.validators';

@Component({
  selector: 'app-employee-add',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent {
  responseData: any;
  errorMessage: any;
  departments: Department[];

  employeeAddForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    image: [
      null,
      [
        Validators.required,
        fileTypeValidator(['image/jpg', 'image/png']),
        fileSizeValidator(2),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  addEmployee() {
    this.employeeService
      .addEmployee(this.employeeAddForm.getRawValue())
      .subscribe({
        next: (result) => {
          this.responseData = result;
          this.employeeAddForm.reset();
          this.errorMessage = null;
          this.router.navigate(['employee']);
        },
        error: (err) => {
          if (err.status === 0) {
            // Network error (no connection, server down, CORS, etc.)
            this.errorMessage =
              'Error creating employee. Please try again later.';
          } else if (err.status === 400) {
            // Bad request / model validation
            this.errorMessage = err.error;
          }
        },
      });
  }
}
