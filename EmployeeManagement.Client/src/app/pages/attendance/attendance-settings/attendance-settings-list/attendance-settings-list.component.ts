import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AttendanceSettingEditDialogComponent } from 'src/app/components/attendance-setting-edit-dialog/attendance-setting-edit-dialog.component';
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

  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
  ) {}

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

  editAttendanceSetting(attendanceSetting: AttendanceSetting) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Attendance Setting',
      attendanceSetting: attendanceSetting,
    };

    this.dialog.open(AttendanceSettingEditDialogComponent, dialogConf);
  }
}
