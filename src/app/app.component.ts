import { Component } from '@angular/core';
import { JsonPipe, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarDate, UiCalendarMonthComponent } from '../../projects/brocol-ui/src/public-api';

@Component({
  selector: 'app-root',
  imports: [UiCalendarMonthComponent, NgFor, JsonPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  determineSelectedDates(newSelection: CalendarDate) {
    if(this.mode.value === 2 && this.selectedDate.length < 2) {
      if(this.selectedDate[0].isSame(newSelection)) {
        return [newSelection, newSelection];
      }
      
      if(newSelection.isBefore(this.selectedDate[0])) {
        return [newSelection, this.selectedDate[0]];
      }

      if(newSelection.isAfter(this.selectedDate[0])) {
        return [this.selectedDate[0], newSelection];
      }
    }
  
    return [newSelection];
  }

  onSelect([newSelection]: CalendarDate[]) {
    this.selectedDate = this.determineSelectedDates(newSelection);
  }

  get selectedFirstDayOfweek() {
    return <number>this.firstDayOfWeek.value;
  }

  title = 'angular-forms';
  selectedDate = [CalendarDate.fromLocalToUTC(new Date())];
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
