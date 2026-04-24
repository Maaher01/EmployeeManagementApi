import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];
  loggedInUser: DecodedToken | null = null;
  errorResponse: any;
  displayedColumns: string[] = ['username', 'email', 'role', 'action'];
  dataSource: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getUserInfo();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.dataSource = this.users;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  getUserInfo() {
    this.loggedInUser = this.authService.getUserInfo();
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.getAllUsers();
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
