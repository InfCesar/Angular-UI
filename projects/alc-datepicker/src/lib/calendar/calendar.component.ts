import { Component, OnInit } from '@angular/core';
import { CalendarDate } from './calendar-date';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AlcCalendarMonthComponent } from './calendar-month/calendar-month.component';
import { ActiveDate } from '../types/active-date.type';

@Component({
  selector: 'alc-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  imports: [JsonPipe, AlcCalendarMonthComponent, ReactiveFormsModule],
  styleUrls: ['./calendar.component.scss'],
})
export class AlcCalendarComponent implements OnInit {
  selectedDate: CalendarDate[] = [];
  options = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  firstDayOfWeek = new FormControl(1, Validators.required);
  mode = new FormControl(1, Validators.required);

  activeDate?: ActiveDate;
  activeMonth = CalendarDate.fromLocalToUTC(new Date());
  numOfMonthsShown = 2;

  // TODO: implementar minimo y maximo para las fechas mostrables. En caso de que no sean mostrables, no permitir su activación mediante teclado
  // qué ocurre con las fechas desactivadas y la interacción por teclado? He enviado un correo sobre esto.
  get selectedFirstDayOfweek() {
    return <number>this.firstDayOfWeek.value;
  }

  get months() {
    const firstMonth = this.activeMonth;
    return Array.from({ length: this.numOfMonthsShown }, (_, index) =>
      firstMonth.getFirstDayOfMonth().addUTCMonths(index)
    );
  }

  get selectedDates() {
    return this.selectedDate.map((date) => date.toISOString());
  }

  ngOnInit() {
    this.activeDate = { date: this.selectedDate[0] ?? this.activeMonth };
  }

  onActiveDateChange(event: ActiveDate) {
    this.activeDate = event;
    this.changeMonthsOnActiveChange();
  }

  onSelect([newSelection]: CalendarDate[]) {
    this.selectedDate = this.determineSelectedDates(newSelection);
    this.activeDate = { date: newSelection };
  }

  changeMonthsOnActiveChange() {
    const active = this.activeDate?.date;
    const lastMonthShown = this.months[this.months.length - 1];
    const firstMonthShown = this.months[0];

    if (active?.isBefore(firstMonthShown.getFirstDayOfMonth())) {
      this.activeMonth = this.activeMonth.addUTCMonths(-1).getFirstDayOfMonth();
      return;
    }

    if (active?.isAfter(lastMonthShown.getLastDayOfMonth())) {
      this.activeMonth = this.activeMonth.addUTCMonths(+1).getFirstDayOfMonth();
      return;
    }
  }

  determineSelectedDates(newSelection: CalendarDate) {
    if (this.mode.value === 2 && this.selectedDate.length < 2) {
      if (this.selectedDate[0].isSame(newSelection)) {
        return [newSelection, newSelection];
      }

      if (newSelection.isBefore(this.selectedDate[0])) {
        return [newSelection, this.selectedDate[0]];
      }

      if (newSelection.isAfter(this.selectedDate[0])) {
        return [this.selectedDate[0], newSelection];
      }
    }

    return [newSelection];
  }

  protected prevActiveMonth() {
    this.activeMonth = this.activeMonth.addUTCMonths(-1);
    this.updateActiveDateOnMonthChange();
  }

  protected nextActiveMonth() {
    this.activeMonth = this.activeMonth.addUTCMonths(1);
    this.updateActiveDateOnMonthChange();
  }

  private updateActiveDateOnMonthChange() {
    if (!this.activeDate?.date.isInMonthsRange(this.months)) {
      this.activeDate = { date: this.months[0].getFirstDayOfMonth() };
    }
  }

  trackByMonth(_: number, month: CalendarDate) {
    return month.getTime().toString();
  }
}
