import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-details',
  imports: [CommonModule, MaterialModule],
  providers: [DatePipe],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements OnInit {
  loggedInUser: DecodedToken | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.loggedInUser = this.authService.getUserInfo();
    console.log(this.loggedInUser);
  }
}
