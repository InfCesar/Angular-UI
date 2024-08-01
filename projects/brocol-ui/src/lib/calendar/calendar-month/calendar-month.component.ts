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
import { CalendarBuilderPipe } from './calendar-builder.pipe';
import { DaysOfTheWeekPipe } from './days-of-week.pipe';
import { UI_CALENDAR_SELECTION_STRATEGY } from '../selection-strategy';
import { DayStatusPipe } from './calendar-status.pipe';
import { DaysOfTheWeek } from '../names.type';
import { Day } from '../day.type';

@Component({
  selector: 'ui-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgFor, CalendarBuilderPipe, DaysOfTheWeekPipe, DayStatusPipe, NgIf, NgClass],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCalendarMonthComponent {
  @Input() monthIndex = new Date().getMonth(); 
  @Input() year = new Date().getFullYear();
  @Input() firstDayOfWeek = 0; // 0 => Sunday
  @Input() weekDaysNames: DaysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  @Input() selected?: CalendarDate[];
  @Output() selectedChange = new EventEmitter<CalendarDate[]>();

  private selectionStrategy = inject(UI_CALENDAR_SELECTION_STRATEGY);

  trackDaysBy(_: number, day: Day) {
    return day.id;
  }

  protected selectDay({date}: Day) {
    this.selected = this.selectionStrategy.onSelect(date, this.selected);
    this.selectedChange.emit(this.selected);
  }
}
