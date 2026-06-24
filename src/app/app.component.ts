import { Component } from '@angular/core';
import { UiButtonComponent } from '../../projects/alc-datepicker/src/public-api';
import { UiCalendarComponent } from '../../projects/alc-datepicker/src/lib/calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [UiCalendarComponent, UiButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
