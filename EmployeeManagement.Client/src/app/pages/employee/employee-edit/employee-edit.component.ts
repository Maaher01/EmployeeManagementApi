import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.interface';
import { Department } from 'src/app/models/department.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import {
  fileSizeValidator,
  fileTypeValidator,
} from 'src/app/shared/validators/file.validator';
import { ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DepartmentService } from 'src/app/services/department.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-employee-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  errorMessage: any;
  employee: Employee;
  departments: Department[];
  fileName = '';
  imageUrl: string | null = null;
  imagePreview: string | null = null;

  employeeEditForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    departmentId: [0, [Validators.required]],
    dateOfJoining: ['', [Validators.required]],
    image: [
      null as File | null,
      [fileTypeValidator(['image/jpeg', 'image/png']), fileSizeValidator(2)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.imageUrl = employee.image
          ? 'https://localhost:7063/Photos/' + employee.image
          : null;

        this.employeeEditForm.patchValue({
          name: employee.name,
          departmentId: employee.departmentId,
          dateOfJoining: employee.dateOfJoining,
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.employeeEditForm.controls.image.setValue(file);
    this.employeeEditForm.controls.image.markAsTouched();
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

  editEmployee() {
    const formValue = this.employeeEditForm.getRawValue();

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
      this.submitEmployee(formValue, this.employee.image ?? '');
    }
  }

  submitEmployee(formValue: any, fileName: string) {
    const payload = {
      name: formValue.name,
      departmentId: formValue.departmentId,
      dateOfJoining:
        this.datePipe.transform(formValue.dateOfJoining, 'yyyy-MM-dd') ?? '',
      image: fileName,
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
