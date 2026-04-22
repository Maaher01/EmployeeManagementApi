import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role.interface';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit {
  responseData: any;
  errorMessage: any;
  roles: Role[];
  employees: Employee[];

  userAddForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    employeeId: [''],
  });

  ngOnInit(): void {
    this.getAllRoles();
    this.getAllEmployees();
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private employeeService: EmployeeService,
    private roleService: RoleService,
  ) {}

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  addUser() {
    this.userService.addUser(this.userAddForm.getRawValue()).subscribe({
      next: (res) => {
        this.responseData = res;
        this.userAddForm.reset();
        this.errorMessage = null;
        this.router.navigate(['user']);
      },
      error: (err) => {
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
