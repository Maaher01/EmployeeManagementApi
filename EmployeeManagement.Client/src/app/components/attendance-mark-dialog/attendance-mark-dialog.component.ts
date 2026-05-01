import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-mark-dialog',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './attendance-mark-dialog.component.html',
  styleUrl: './attendance-mark-dialog.component.scss',
})
export class AttendanceMarkDialogComponent {
  heading: string;
  errorMessage: any;

  inTimeForm = this.fb.nonNullable.group({
    date: [''],
    inTime: [''],
    outTime: [],
  });

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private dialogRef: MatDialogRef<AttendanceMarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }
}
