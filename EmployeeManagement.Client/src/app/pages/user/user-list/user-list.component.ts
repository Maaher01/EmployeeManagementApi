import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [],
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

  getAllUsers() {}
}
