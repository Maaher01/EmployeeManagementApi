import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceSetting } from 'src/app/models/attendance-setting';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-settings-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './attendance-settings-list.component.html',
  styleUrl: './attendance-settings-list.component.scss',
})
export class AttendanceSettingsListComponent implements OnInit {
  settings: AttendanceSetting[];
  errorResponse: any;
  displayedColumns: string[] = [
    'departmentName',
    'inTime',
    'outTime',
    'gracePeriodMinutes',
    'actions',
  ];
  dataSource: any;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.getAllSettings();
  }

  getAllSettings() {
    this.attendanceService.getAttendanceSettings().subscribe({
      next: (res) => {
        console.log(res);
        this.settings = res;
        this.dataSource = this.settings;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }
}
