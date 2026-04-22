import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[];
  errorResponse: any;
  displayedColumns: string[] = ['username', 'email', 'role', 'action'];
  dataSource: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
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
}
