import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';
import { Attendance } from 'src/app/models/attendance';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
})
export class AttendanceListComponent implements OnInit {
  attendance: Attendance[] = [];
  dateControl = new FormControl(new Date());
  errorResponse: any;
  isLoading: boolean = false;
  displayedColumns: string[] = [
    'employeeName',
    'date',
    'inTime',
    'outTime',
    'note',
    'status',
    'actions',
  ];
  dataSource: any;

  ngOnInit(): void {
    this.getAttendanceByDate(new Date());

    this.dateControl.valueChanges.subscribe((date) => {
      if (date) this.getAttendanceByDate(date);
    });
  }

  constructor(private attendanceService: AttendanceService) {}

  getAttendanceByDate(date: Date) {
    this.isLoading = true;
    const dateStr = formatDate(date, 'yyyy-MM-dd', 'en');
    this.attendanceService.getAttendanceByDate(dateStr).subscribe({
      next: (res) => {
        console.log(res);

        this.attendance = res;
        this.dataSource = this.attendance;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
  }

  getStatus(status: number): { label: string; class: string } {
    switch (status) {
      case 0:
        return { label: 'Present', class: 'chip-present' };
      case 1:
        return { label: 'Late', class: 'chip-late' };
      case 2:
        return { label: 'Absent', class: 'chip-absent' };
      default:
        return { label: 'Unknown', class: '' };
    }
  }
}
