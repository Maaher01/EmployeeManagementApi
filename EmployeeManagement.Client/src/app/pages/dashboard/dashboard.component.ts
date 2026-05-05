import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AttendanceMarkCardComponent } from 'src/app/components/attendance-mark-card/attendance-mark-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { DecodedToken } from 'src/app/models/decoded-token.interface';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, AttendanceMarkCardComponent],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  currentUser: DecodedToken | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );
  }
}
