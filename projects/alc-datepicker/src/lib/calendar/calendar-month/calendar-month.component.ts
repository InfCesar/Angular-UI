import { NgClass, WeekDay } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { buildMonth } from './month-body/month-body';
import { AlcMonthHeaderPipe } from './month-header/month-header.pipe';
import { AlcDayStatePipe } from './day-state/day-state.pipe';
import { CellStateField, Day } from '../../types/day.type';
import { Week } from '../../types/week.type';
import { ActiveDate } from '../../types/active-date.type';
import { AlcActiveDateDirective } from './active-date/active-date.directive';
import { AlcDateI18n } from '../../locale/date-formatter';

@Component({
  selector: 'alc-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [AlcMonthHeaderPipe, AlcDayStatePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlcCalendarMonthComponent extends AlcActiveDateDirective {
  month = input(CalendarDate.fromLocalToUTC(new Date()));
  selected = model<CalendarDate[]>([]);
  activeDate = model<ActiveDate>({ date: this.month() });
  firstDayOfWeek = input(WeekDay.Sunday);

  protected DayStateField = CellStateField;
  protected formatter = inject(AlcDateI18n);
  protected readonly weekDaysNames = this.formatter.weekDayNames;
  protected readonly monthName = this.formatter.dateName(this.month, {
    month: 'long',
  });
  protected readonly weeks = computed(() =>
    buildMonth(this.month(), this.firstDayOfWeek())
  );
  protected readonly dayLabels = computed(() =>
    Object.fromEntries(
      this.weeks()
        .flat()
        .map((day) => [day.id, this.formatter.dayLabel(day.date)])
    )
  );

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

  protected get year() {
    return this.month().getUTCFullYear();
  }
}
