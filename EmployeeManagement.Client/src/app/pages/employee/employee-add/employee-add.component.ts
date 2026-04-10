import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EmployeeAdd } from 'src/app/models/employee-add.interface';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material.module';

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
    MatSelect,
    MatOption,
    MatDatepickerModule,
    MaterialModule,
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent implements OnInit {
  responseData: any;
  errorMessage: any;
  departments: Department[];
  currentFile?: File;
  fileName = '';

  employeeAddForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    image: [
      null,
      [fileTypeValidator(['image/jpg', 'image/png']), fileSizeValidator(2)],
    ],
  });

  ngOnInit(): void {
    this.getAllDepartments();
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private datePipe: DatePipe,
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
    const formValue = this.employeeAddForm.getRawValue();

    const payload: EmployeeAdd = {
      ...formValue,
      dateOfJoining:
        this.datePipe.transform(formValue.dateOfJoining, 'yyyy-MM-dd') ?? '',
    };

    this.employeeService.addEmployee(payload).subscribe({
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
