import { NgClass, NgFor, NgIf, WeekDay } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { UI_CALENDAR_SELECTION_STRATEGY } from '../selection-strategy';
import { WeekNames, MonthsNames } from '../names.type';
import { Day } from '../day.type';
import { UiMonthBodyPipe } from './month-body/month-body.pipe';
import { UiMonthHeaderPipe } from './month-header/month-header.pipe';
import { UiDayStatePipe } from './day-state/day-state.pipe';
import { monthNames, weekNames } from './calendar-month.data';

@Component({
  selector: 'ui-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgFor, UiMonthBodyPipe, UiMonthHeaderPipe, UiDayStatePipe, NgIf, NgClass],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCalendarMonthComponent {
  @Input() month: CalendarDate = CalendarDate.fromLocalToUTC(new Date());
  @Input() firstDayOfWeek: WeekDay = WeekDay.Sunday;
  @Input() monthsNames: MonthsNames = monthNames;
  @Input() weekDaysNames: WeekNames = weekNames;
  @Input() selected?: CalendarDate[];
  @Output() selectedChange = new EventEmitter<CalendarDate[]>();

  private selectionStrategy = inject(UI_CALENDAR_SELECTION_STRATEGY);

  protected trackDaysBy(_: number, day: Day) {
    return day.id;
  }

  protected selectDay({date}: Day) {
    this.selected = this.selectionStrategy.onSelect(date, this.selected);
    this.selectedChange.emit(this.selected);
  }

  protected get monthName(){
    const monthIndex = this.month.getUTCMonth();
    return this.monthsNames[monthIndex];
  }

  protected get year() {
    return this.month.getUTCFullYear();
  }
}
