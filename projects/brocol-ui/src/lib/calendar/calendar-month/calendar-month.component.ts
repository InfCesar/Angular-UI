import { NgClass, NgFor, NgIf } from '@angular/common';
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
import { DaysOfTheWeek, NamesOfTheMonth } from '../names.type';
import { Day } from '../day.type';
import { UiMonthBodyPipe } from './month-body/month-body.pipe';
import { UiMonthHeaderPipe } from './month-header/month-header.pipe';
import { UiDayStatePipe } from './day-state/day-state.pipe';

@Component({
  selector: 'ui-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgFor, UiMonthBodyPipe, UiMonthHeaderPipe, UiDayStatePipe, NgIf, NgClass],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCalendarMonthComponent {
  @Input() monthIndex: number = new Date().getMonth(); 
  @Input() year: number = new Date().getFullYear();
  @Input() firstDayOfWeek = 0; // 0 => Sunday // TODO: añadir transform y caso a storybook
  @Input() monthsNames: NamesOfTheMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  @Input() weekDaysNames: DaysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  @Input() selected?: CalendarDate[];
  @Output() selectedChange = new EventEmitter<CalendarDate[]>();

  private selectionStrategy = inject(UI_CALENDAR_SELECTION_STRATEGY);

  protected get currentMonth() {
    const {length} = this.monthsNames;
    return (length - ((length - this.monthIndex) % length)) % length;
  }

  protected get currentYear() {
    return this.year + Math.floor(this.monthIndex / this.monthsNames.length);
  }

  protected trackDaysBy(_: number, day: Day) {
    return day.id;
  }

  protected selectDay({date}: Day) {
    this.selected = this.selectionStrategy.onSelect(date, this.selected);
    this.selectedChange.emit(this.selected);
  }
}
