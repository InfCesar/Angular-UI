import { Component } from '@angular/core';
import { UiButtonComponent } from '../../projects/brocol-ui/src/public-api';
import { UiCalendarComponent } from '../../projects/brocol-ui/src/lib/calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [UiCalendarComponent, UiButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
