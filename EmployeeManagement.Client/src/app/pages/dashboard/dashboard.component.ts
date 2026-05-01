import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AttendanceMarkCardComponent } from 'src/app/components/attendance-mark-card/attendance-mark-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, AttendanceMarkCardComponent],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {}
