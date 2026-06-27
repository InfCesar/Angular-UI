import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { AlcMonthBodyPipe } from './month-body/month-body.pipe';
import { AlcMonthHeaderPipe } from './month-header/month-header.pipe';
import { AlcDayStatePipe } from './day-state/day-state.pipe';
import { monthNames, weekNames } from './calendar-month.data';
import { CellStateField, Day } from '../../types/day.type';
import { Week } from '../../types/week.type';
import { ActiveDate } from '../../types/active-date.type';
import { AlcActiveDateDirective } from './active-date/active-date.directive';

@Component({
  selector: 'alc-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [AlcMonthBodyPipe, AlcMonthHeaderPipe, AlcDayStatePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlcCalendarMonthComponent extends AlcActiveDateDirective {
  month = input(CalendarDate.fromLocalToUTC(new Date()));
  monthsNames = input(monthNames);
  weekDaysNames = input(weekNames);

  selected = model<CalendarDate[]>([]);
  activeDate = model<ActiveDate>({ date: this.month() });

  protected DayStateField = CellStateField;

  protected trackDaysBy(_: number, day: Day) {
    return day.id;
  }

  protected trackWeeksBy(_: number, week: Week) {
    return week[0].id;
  }

  protected selectDay({ date }: Day, event?: Event) {
    event?.preventDefault();
    this.selected.set([date]);
  }

  protected get monthName() {
    const monthIndex = this.month().getUTCMonth();
    return this.monthsNames()[monthIndex];
  }

  protected get year() {
    return this.month().getUTCFullYear();
  }
}
