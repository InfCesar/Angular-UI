import { NgClass, WeekDay } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { CalendarDate } from '../calendar-date';
import { UiMonthBodyPipe } from './month-body/month-body.pipe';
import { UiMonthHeaderPipe } from './month-header/month-header.pipe';
import { UiDayStatePipe } from './day-state/day-state.pipe';
import { monthNames, weekNames } from './calendar-month.data';
import { MonthsNames, WeekNames } from '../../types/names.type';
import { CellStateField, Day } from '../../types/day.type';
import { Week } from '../../types/week.type';

@Component({
	selector: 'ui-calendar-month',
	templateUrl: './calendar-month.component.html',
	styleUrls: ['./calendar-month.component.scss'],
	imports: [UiMonthBodyPipe, UiMonthHeaderPipe, UiDayStatePipe, NgClass],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCalendarMonthComponent {
	@Input() month: CalendarDate = CalendarDate.fromLocalToUTC(new Date());
	@Input() firstDayOfWeek: WeekDay = WeekDay.Sunday;
	@Input() monthsNames: MonthsNames = monthNames;
	@Input() weekDaysNames: WeekNames = weekNames;
	@Input() selected?: CalendarDate[] = [];
	@Output() selectedChange = new EventEmitter<CalendarDate[]>();
	@Input() activeDate?: CalendarDate;

	protected DayStateField = CellStateField;

	protected trackDaysBy(_: number, day: Day) {
		return day.id;
	}

	protected trackWeeksBy(_: number, week: Week) {
		return week[0].id;
	}

	protected selectDay({ date }: Day) {
		this.selectedChange.emit([date]);
	}

	protected get monthName() {
		const monthIndex = this.month.getUTCMonth();
		return this.monthsNames[monthIndex];
	}

	protected get year() {
		return this.month.getUTCFullYear();
	}
}
