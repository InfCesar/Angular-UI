import { Component } from '@angular/core';
import { AlcCalendarComponent } from '../../projects/alc-datepicker/src/lib/calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [AlcCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
