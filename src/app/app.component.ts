import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { UiButtonComponent } from './components/button/button.component';
import { CalendarDate } from './components/calendar/calendar-date';
import { UICalendarMonthComponent } from './components/calendar/calendar-month/calendar-month.component';
import { UI_CALENDAR_SELECTION_STRATEGY, UiCalendarSelectionStrategy } from './components/calendar/calendar.config';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrocolUiComponent } from '../../projects/brocol-ui/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, UiButtonComponent, UICalendarMonthComponent, NgFor, JsonPipe, ReactiveFormsModule, BrocolUiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: UI_CALENDAR_SELECTION_STRATEGY,
      useExisting: AppComponent
    }
  ]
})
export class AppComponent implements UiCalendarSelectionStrategy {
  onSelect(newSelection: CalendarDate, selectedDays: CalendarDate[] = []): CalendarDate[] {
    console.info('this.mode.value', this.mode.value);
    if(this.mode.value === 1 || selectedDays.length >= 2) {
      return [newSelection];
    }

    if(selectedDays[0].isSame(newSelection)) {
      return [newSelection, newSelection];
    }
    
    if(newSelection.isBefore(selectedDays[0])) {
      return [newSelection, selectedDays[0]];
    }

    if(newSelection.isAfter(selectedDays[0])) {
      return [selectedDays[0], newSelection];
    }
  
    return selectedDays;
  }

  get selectedFirstDayOfweek() {
    return <number>this.firstDayOfWeek.value;
  }

  title = 'angular-forms';
  selectedDate = [CalendarDate.parseDateAsLocalTime(new Date())];
  monthIndex = this.selectedDate[0].getMonth();
  firstDayOfWeek = new FormControl(1, Validators.required);
  mode = new FormControl(1, Validators.required);

  options = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

  get selectedDates() {
    return this.selectedDate.map((date)=>date.toISOString());
  }
}
