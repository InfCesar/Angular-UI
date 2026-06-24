import { Component, effect, OnInit } from '@angular/core';
import { CalendarDate } from './calendar-date';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AlcCalendarMonthComponent } from './calendar-month/calendar-month.component';
import { AlcActiveDateDirective } from './active-date.directive';

@Component({
  selector: 'alc-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  imports: [JsonPipe, AlcCalendarMonthComponent, ReactiveFormsModule],
  styleUrls: ['./calendar.component.scss'],
})
export class AlcCalendarComponent
  extends AlcActiveDateDirective
  implements OnInit
{
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

  // TODO: primero hacer tests de todos los demás componentes / directivas, y subirlo todo.
  // Luego, atender a los comentarios para simplificar este componente y subirlo también, con sus tests correspondientes.

  // TODO: mover junto a activedate? meter como Input<>, pero no activeDate. activeDate no debería ser un input, sino una property
  activeMonth = CalendarDate.fromLocalToUTC(new Date());
  numOfMonthsShown = 2;

  // TODO: implementar minimo y maximo para las fechas mostrables. En caso de que no sean mostrables, no permitir su activación mediante teclado
  // qué ocurre con las fechas desactivadas y la interacción por teclado? He enviado un correo sobre esto.

  // TODO: Llevar a la directiva
  private activeMonthChangeEffect = effect(() => {
    this.changeMonthsOnActiveChange();
  });

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
    // Aquí deberíamos hacer que el mes activo = fecha seleccionada. mover a directiva
    this.activeDate.set(this.selectedDate[0] || this.activeMonth);
  }

  onSelect([newSelection]: CalendarDate[]) {
    this.selectedDate = this.determineSelectedDates(newSelection);
    this.activeDate.set(newSelection); // TODO: activeDate podría ser una computed?
  }

  changeMonthsOnActiveChange() {
    const active = this.activeDate();
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
    // activeMonth será una signal en la directiva
    this.activeMonth = this.activeMonth.addUTCMonths(-1);
    this.updateActiveDateOnMonthChange();
  }

  protected nextActiveMonth() {
    // activeMonth será una signal en la directiva
    this.activeMonth = this.activeMonth.addUTCMonths(1);
    this.updateActiveDateOnMonthChange();
  }

  // Effect de la directiva
  private updateActiveDateOnMonthChange() {
    // convertir this.months por activeMonths en directiva (activeMonth actual pasaría a ser un private _firstMonth)
    if (!this.activeDate()?.isInMonthsRange(this.months)) {
      this.activeDate.set(this.months[0].getFirstDayOfMonth());
    }
  }

  trackByMonth(_: number, month: CalendarDate) {
    return month.getTime().toString();
  }
}
