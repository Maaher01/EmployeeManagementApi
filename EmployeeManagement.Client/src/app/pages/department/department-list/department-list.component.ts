import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Department } from 'src/app/models/department.interface';
import { DepartmentService } from 'src/app/services/department.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DepartmentEditDialogComponent } from 'src/app/components/department-edit-dialog/department-edit-dialog.component';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments: Department[];
  errorResponse: any;
  displayedColumns: string[] = ['name', 'action'];
  dataSource: any;

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.dataSource = this.departments;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  editDepartment(department: Department) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Department',
      department: department,
    };

    this.dialog.open(DepartmentEditDialogComponent, dialogConf);
  }

  deleteDepartment(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Department',
        message: 'Are you sure you want to delete this department?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            this.getAllDepartments();
          },
          error: (err) => {
            if (err.status === 400) {
              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete department',
                  message:
                    'This department has employees. Delete all its employees first to delete the department',
                },
              });
            } else {
              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete department',
                  message:
                    'There was an error deleting the department. Please try again later',
                },
              });
            }
          },
        });
      }
    });
  }
}
