import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/services/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-add',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './department-add.component.html',
})
export class DepartmentAddComponent {
  responseData: any;
  errorMessage: any;

  departmentAddForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  addDepartment() {
    this.departmentService
      .addDepartment(this.departmentAddForm.getRawValue())
      .subscribe({
        next: (result) => {
          this.responseData = result;
          this.departmentAddForm.reset();
          this.errorMessage = null;
          this.router.navigate(['department']);
        },
        error: (err) => {
          console.log('Error message', err);
          if (err.status === 0) {
            // Network error (no connection, server down, CORS, etc.)
            this.errorMessage =
              'Error creating department. Please try again later.';
          } else if (err.status === 400) {
            // Bad request / model validation
            this.errorMessage = err.error;
          }
        },
      });
  }
}
