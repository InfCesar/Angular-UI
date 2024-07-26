import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../calendar-date";
import { Week } from "../calendar.model";

const daysInAWeek = 7;

@Pipe({
  name: 'calendarBuilder',
  pure: true,
  standalone: true,
}) export class CalendarBuilderPipe implements PipeTransform {

  transform(monthIndex: number, year: number, firstDayOfWeekIndex: number) {
    return this.buildMonth(monthIndex, year, firstDayOfWeekIndex);
  }

  private buildMonth(monthIndex: number, year: number, firstDayOfWeekIndex: number): Week[] {
    const firstDayOfMonth = new CalendarDate(year, monthIndex, 1);
    const lastDayOfMonth = new CalendarDate(year, monthIndex, firstDayOfMonth.getDaysInMonth());
    const previousMonthDays = this.getPreviousMonthDays(firstDayOfMonth, firstDayOfWeekIndex);
    const month: Week[] = [[]];

    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - previousMonthDays);

    for (
      let date = firstDayOfMonth;
      date.isSameOrBefore(lastDayOfMonth);
      date = date.clone().addDays(1)
    ) {
      let currentWeek = month[month.length - 1];
      if (currentWeek.length === daysInAWeek) {
        currentWeek = [];
        month.push(currentWeek);
      }
      currentWeek.push({
        date,
        dayNumber: date.getDate(),
        id: date.getTime().toString()
      });
    }
    return month;
  }

  private getPreviousMonthDays(firstDayOfMonth: CalendarDate, firstDayOfWeekIndex: number) {
    const previousMonthDays = (firstDayOfMonth.getDayOfWeek() - firstDayOfWeekIndex);
    return previousMonthDays < 0 ? (daysInAWeek + previousMonthDays) : previousMonthDays;
  }
}