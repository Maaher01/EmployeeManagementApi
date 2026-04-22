import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { Department } from 'src/app/models/department.interface';
import { DepartmentService } from 'src/app/services/department.service';
import {
  fileSizeValidator,
  fileTypeValidator,
} from 'src/app/shared/validators/file.validators';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EmployeeAdd } from 'src/app/models/employee-add.interface';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-employee-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent implements OnInit {
  responseData: any;
  errorMessage: any;
  departments: Department[];
  fileName = '';
  imagePreview: string | null = null;

  employeeAddForm = this.fb.nonNullable.group({
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
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private datePipe: DatePipe,
  ) {}

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.employeeAddForm.controls.image.setValue(file);
    this.employeeAddForm.controls.image.markAsTouched();
    this.fileName = file ? file.name : '';

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
    }
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

  addEmployee() {
    const formValue = this.employeeAddForm.getRawValue();

    if (formValue.image) {
      const imageData = new FormData();
      imageData.append('file', formValue.image);

      this.employeeService.uploadImage(imageData).subscribe({
        next: (fileName: string) => {
          this.submitEmployee(formValue, fileName);
        },
        error: () => {
          this.errorMessage = 'Error uploading image. Please try again.';
        },
      });
    } else {
      this.submitEmployee(formValue, '');
    }
  }

  private submitEmployee(formValue: any, fileName: string) {
    const payload: EmployeeAdd = {
      name: formValue.name,
      departmentId: formValue.departmentId,
      dateOfJoining:
        this.datePipe.transform(formValue.dateOfJoining, 'yyyy-MM-dd') ?? '',
      image: fileName,
    };

    this.employeeService.addEmployee(payload).subscribe({
      next: (result) => {
        this.responseData = result;
        this.employeeAddForm.reset();
        this.fileName = '';
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
