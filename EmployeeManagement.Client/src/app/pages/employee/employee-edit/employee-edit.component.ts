import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.interface';
import { Department } from 'src/app/models/department.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  fileSizeValidator,
  fileTypeValidator,
} from 'src/app/shared/validators/file.validators';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { DepartmentService } from 'src/app/services/department.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-employee-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIcon,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatError,
    MatDatepickerModule,
    MatOption,
    MatSelect,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  errorMessage: any;
  employee: Employee;
  departments: Department[];

  employeeEditForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    image: [
      null as File | null,
      [fileTypeValidator(['image/jpeg', 'image/png']), fileSizeValidator(2)],
    ],
  });

  ngOnInit(): void {
    this.getAllDepartments();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        console.log(employee);

        this.employee = employee;
        this.employeeEditForm.patchValue({
          name: employee.name,
          departmentId: employee.departmentId.toString(),
          dateOfJoining: employee.dateOfJoining,
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
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

  editEmployee() {
    const payload = {
      name: this.employeeEditForm.controls['name'].value!,
      departmentId: this.employeeEditForm.controls['departmentId'].value!,
      dateOfJoining: this.employeeEditForm.controls['dateOfJoining'].value!,
      image: this.employeeEditForm.controls['image'].value!,
    };

    this.employeeService.editEmployee(this.employee.id, payload).subscribe({
      next: () => {
        this.employeeEditForm.reset();
        this.errorMessage = null;
        this.router.navigate(['employee']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }
}
