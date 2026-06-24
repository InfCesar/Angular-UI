import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../../calendar-date";
import { WeekDay } from "@angular/common";
import { Week } from "../../../types/week.type";

@Pipe({
  name: 'monthBody',
  pure: true,
  standalone: true,
}) export class UiMonthBodyPipe implements PipeTransform {

  transform(month: CalendarDate, firstDayOfWeek = WeekDay.Sunday) {
    return this.buildMonth(month, firstDayOfWeek);
  }

  private buildMonth(month: CalendarDate, firstDayOfWeek: WeekDay): Week[] {
    const firstDayOfMonth = month.getFirstDayOfMonth();
    const lastDayOfMonth = month.getLastDayOfMonth();
    const weeks: Week[] = [];

    for (
      let date = firstDayOfMonth;
      date.isSameOrBefore(lastDayOfMonth);
      date = date.addUTCDays(1)
    ) {
      let currentWeek = weeks[weeks.length - 1];
      if (!currentWeek || (date.getUTCDay() === firstDayOfWeek)) {
        currentWeek = [];
        weeks.push(currentWeek);
      }
      currentWeek.push({
        date,
        dayNumber: date.getUTCDate(),
        id: date.getTime().toString()
      });
    }
    return weeks;
  }
}