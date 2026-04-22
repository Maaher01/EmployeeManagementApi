import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[];
  errorResponse: any;
  displayedColumns: string[] = [
    'id',
    'image',
    'name',
    'departmentName',
    'dateOfJoining',
    'action',
  ];
  dataSource: any;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.dataSource = this.employees;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  deleteEmployee(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.getAllEmployees();
          },
          error: (err) => {
            if (err) {
              console.log(err);

              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete employee',
                  message:
                    'There was an unknown error. Please try again later.',
                },
              });
            }
          },
        });
      }
    });
  }
}
