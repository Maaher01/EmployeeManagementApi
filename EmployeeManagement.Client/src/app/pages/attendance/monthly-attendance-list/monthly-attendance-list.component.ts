import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Attendance } from 'src/app/models/attendance';
import { Employee } from 'src/app/models/employee.interface';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-monthly-attendance-list',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './monthly-attendance-list.component.html',
  styleUrl: './monthly-attendance-list.component.scss',
})
export class MonthlyAttendanceListComponent {
  monthlyAttendance: Attendance[] = [];
  employees: Employee[] = [];
  monthControl = new FormControl(new Date());
  today = new Date();
  errorResponse: any;
  isLoading: boolean = false;
  displayedColumns: string[] = ['date', 'inTime', 'outTime', 'note', 'status'];
  dataSource: any;
  selectedEmployeeId: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();

    this.route.queryParams.subscribe((params) => {
      const employeeIdParam = params['employeeId'];
      const monthParam = params['month'];
      const yearParam = params['year'];

      if (employeeIdParam) {
        this.selectedEmployeeId = Number(employeeIdParam);
      }

      if (monthParam && yearParam) {
        const restoredDate = new Date(
          Number(yearParam),
          Number(monthParam) - 1,
          1,
        );

        this.monthControl.setValue(restoredDate, { emitEvent: false });
      }

      const date = this.monthControl.value ?? new Date();

      if (this.selectedEmployeeId) {
        this.getMonthlyAttendanceByEmployee(
          this.selectedEmployeeId,
          date.getMonth() + 1,
          date.getFullYear(),
        );
      }

      this.monthControl.valueChanges.subscribe((date) => {
        if (date) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            },
            queryParamsHandling: 'merge',
          });
        }
      });
    });
  }

  onEmployeeChange(employeeId: number): void {
    this.selectedEmployeeId = employeeId;
    const date = this.monthControl.value ?? new Date();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        employeeId: employeeId,
      },
      queryParamsHandling: 'merge',
    });

    this.getMonthlyAttendanceByEmployee(
      employeeId,
      date.getMonth() + 1,
      date.getFullYear(),
    );
  }

  onMonthSelected(date: Date, picker: MatDatepicker<Date>): void {
    this.monthControl.setValue(date);
    picker.close();
  }

  getMonthlyAttendanceByEmployee(id: number, month: number, year: number) {
    this.isLoading = true;
    this.attendanceService
      .getMonthlyAttendanceByEmployee(id, month, year)
      .subscribe({
        next: (res) => {
          this.monthlyAttendance = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorResponse = err.error.message;
          this.isLoading = false;
        },
      });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;

        if (!this.selectedEmployeeId && res.length > 0) {
          this.selectedEmployeeId = res[0].id;
          const date = this.monthControl.value ?? new Date();

          this.getMonthlyAttendanceByEmployee(
            this.selectedEmployeeId,
            date.getMonth() + 1,
            date.getFullYear(),
          );
        }
      },
      error: (err) => {
        this.errorResponse = err.error.message;
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
