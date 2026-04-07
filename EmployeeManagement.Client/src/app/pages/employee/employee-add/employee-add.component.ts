import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
    image: [null, [Validators.required, this.fileTypeValidator]],
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;
      return allowedTypes.includes(file.type)
        ? null
        : { invalidFileType: true };
    };
  }

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
}
