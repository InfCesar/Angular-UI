import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../../calendar-date";
import { Week } from "../../week.type";
import { WeekDay } from "@angular/common";

@Pipe({
  name: 'monthBody',
  pure: true,
  standalone: true,
}) export class UiMonthBodyPipe implements PipeTransform {

  transform(monthIndex: number, year: number, firstDayOfWeek = WeekDay.Sunday) {
    return this.buildMonth(monthIndex, year, firstDayOfWeek);
  }

  private buildMonth(monthIndex: number, year: number, firstDayOfWeek: WeekDay): Week[] {
    const firstDayOfMonth = new CalendarDate(year, monthIndex, 1);
    const lastDayOfMonth = new CalendarDate(year, monthIndex, firstDayOfMonth.getDaysInMonth());
    const month: Week[] = [];

    for (
      let date = firstDayOfMonth;
      date.isSameOrBefore(lastDayOfMonth);
      date = date.addUTCDays(1)
    ) {
      let currentWeek = month[month.length - 1];
      if (!currentWeek || (date.getUTCDay() === firstDayOfWeek)) {
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