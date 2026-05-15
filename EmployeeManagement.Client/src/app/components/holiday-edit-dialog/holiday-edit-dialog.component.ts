import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { HolidayService } from 'src/app/services/holiday.service';
import { endDateAfterStartDate } from 'src/app/shared/validators/date.validator';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-holiday-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './holiday-edit-dialog.component.html',
})
export class HolidayEditDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;
  endDateAfterStartDate = endDateAfterStartDate;
  responseData: any;
  isLoading = false;

  holidayEditForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },
    { validators: this.endDateAfterStartDate },
  );

  ngOnInit(): void {
    this.holidayEditForm.patchValue({
      name: this.data.holiday.name,
      startDate: this.data.holiday.startDate,
      endDate: this.data.holiday.endDate,
    });
  }

  constructor(
    private holidayService: HolidayService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HolidayEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  editHoliday() {
    if (this.holidayEditForm.invalid) return;

    const { name, startDate, endDate } = this.holidayEditForm.getRawValue();

    const payload = {
      name,
      startDate: formatDate(startDate, 'yyyy-MM-dd', 'en'),
      endDate: formatDate(endDate, 'yyyy-MM-dd', 'en'),
    };

    this.holidayService.editHoliday(this.data.holiday.id, payload).subscribe({
      next: () => {
        this.closeDialog();
        window.location.reload();
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
