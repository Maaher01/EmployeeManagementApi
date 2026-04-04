import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department-add',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './department-add.component.html',
  styleUrl: './department-add.component.scss',
})
export class DepartmentAddComponent {
  responseData: any;
  errorMessage: any;

  departmentAddForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
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
          this.errorMessage = err.error.message;
        },
      });
  }
}
