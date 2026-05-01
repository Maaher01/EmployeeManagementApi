import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceMarkDialogComponent } from '../attendance-mark-dialog/attendance-mark-dialog.component';

@Component({
  selector: 'app-attendance-mark-card',
  imports: [MaterialModule],
  templateUrl: './attendance-mark-card.component.html',
  styleUrl: './attendance-mark-card.component.scss',
})
export class AttendanceMarkCardComponent {
  constructor(private dialog: MatDialog) {}

  markAttendance() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'In Time',
      date: new Date(),
    };

    this.dialog.open(AttendanceMarkDialogComponent, dialogConf);
  }
}
