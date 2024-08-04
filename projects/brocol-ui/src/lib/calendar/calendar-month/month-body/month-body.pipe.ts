import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../../calendar-date";
import { Week } from "../../week.type";

@Pipe({
  name: 'monthBody',
  pure: true,
  standalone: true,
}) export class UiMonthBodyPipe implements PipeTransform {

  transform(monthIndex: number, year: number, firstDayOfWeekIndex: number) {
    return this.buildMonth(monthIndex, year, firstDayOfWeekIndex);
  }

  private buildMonth(monthIndex: number, year: number, firstDayOfWeekIndex: number): Week[] {
    const firstDayOfMonth = new CalendarDate(year, monthIndex, 1);
    const lastDayOfMonth = new CalendarDate(year, monthIndex, firstDayOfMonth.getDaysInMonth());
    const month: Week[] = [];

    for (
      let date = firstDayOfMonth;
      date.isSameOrBefore(lastDayOfMonth);
      date = date.clone().addUTCDays(1)
    ) {
      let currentWeek = month[month.length - 1];
      if (!currentWeek || (date.getUTCDay() === firstDayOfWeekIndex)) {
        currentWeek = [];
        month.push(currentWeek);
      }
      currentWeek.push({
        date,
        dayNumber: date.getUTCDate(),
        id: date.getTime().toString()
      });
    }
    return month;
  }
}