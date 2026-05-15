import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { HolidayAddDialogComponent } from 'src/app/components/holiday-add-dialog/holiday-add-dialog.component';
import { HolidayEditDialogComponent } from 'src/app/components/holiday-edit-dialog/holiday-edit-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { Holiday } from 'src/app/models/holiday.interface';
import { HolidayService } from 'src/app/services/holiday.service';
import { getDuration } from 'src/app/shared/date-time.format';

@Component({
  selector: 'app-holiday-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.scss',
})
export class HolidayListComponent implements OnInit {
  holidays = new MatTableDataSource<Holiday>([]);
  errorResponse: any;
  isLoading = false;
  displayedColumns: string[] = [
    'name',
    'startDate',
    'endDate',
    'duration',
    'actions',
  ];
  getDuration = getDuration;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private holidayService: HolidayService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllHolidays();
  }

  ngAfterViewInit() {
    this.holidays.paginator = this.paginator;
  }

  getAllHolidays() {
    this.isLoading = true;
    this.holidayService.getAllHolidays().subscribe({
      next: (res) => {
        this.holidays.data = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
  }

  addHoliday() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Add Holiday',
    };

    this.dialog.open(HolidayAddDialogComponent, dialogConf);
  }

  editHoliday(holiday: Holiday) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit  Holiday',
      holiday: holiday,
    };

    this.dialog.open(HolidayEditDialogComponent, dialogConf);
  }

  deleteHoliday(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Holiday',
        message: 'Are you sure you want to delete this holiday?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.holidayService.deleteHoliday(id).subscribe({
          next: () => {
            this.getAllHolidays();
          },
          error: () => {
            this.dialog.open(WarningDialogComponent, {
              width: '400px',
              data: {
                title: 'Failed to delete department',
                message:
                  'There was an error deleting the holiday. Please try again later',
              },
            });
          },
        });
      }
    });
  }
}
