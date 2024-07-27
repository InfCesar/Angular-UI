import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { Day, DaysOfTheWeek } from '../calendar.model';
import { CalendarBuilderPipe } from './calendar-builder.pipe';
import { DaysOfTheWeekPipe } from './days-of-week.pipe';

@Component({
  selector: 'ui-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgFor, CalendarBuilderPipe, DaysOfTheWeekPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UICalendarMonthComponent {
  @Input() monthIndex = new Date().getMonth(); 
  @Input() year = new Date().getFullYear();
  @Input() firstDayOfWeek = 0; // 0 => Sunday
  @Input() weekDaysNames: DaysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  @Input() selected?: CalendarDate;
  @Output() selectedChange = new EventEmitter<CalendarDate>();

  trackDaysBy(_: number, day: Day) {
    return day.id;
  }
}
