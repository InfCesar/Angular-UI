import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { UiButtonComponent } from '../../projects/brocol-ui/src/lib/button/button.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarDate, UI_CALENDAR_SELECTION_STRATEGY, UiCalendarMonthComponent, UiCalendarSelectionStrategy } from '../../projects/brocol-ui/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, UiButtonComponent, UiCalendarMonthComponent, NgFor, JsonPipe, ReactiveFormsModule],
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
  selectedDate = [CalendarDate.fromLocalToUTC(new Date())];
  monthIndex = this.selectedDate[0].getUTCMonth();
  firstDayOfWeek = new FormControl(1, Validators.required);
  mode = new FormControl(1, Validators.required);
  activeMonth = CalendarDate.fromLocalToUTC(new Date()).getFirstDayOfMonth();
  numOfMonthsShown = 2;

  options = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

  
  get months() {
    const firstMonth = this.activeMonth;
    return Array.from({length: this.numOfMonthsShown}, (_, index) => firstMonth.getFirstDayOfMonth().addUTCMonths(index));
  }

  get selectedDates() {
    return this.selectedDate.map((date)=>date.toISOString());
  }

  protected prevActiveMonth() {
    this.activeMonth = this.activeMonth.addUTCMonths(-1);
  }

  protected nextActiveMonth() {
    this.activeMonth = this.activeMonth.addUTCMonths(1);
  }
}
