import { WeekDay } from '@angular/common';
import { CalendarDate } from '../../calendar-date';
import { Week } from '../../../types/week.type';

export function buildMonth(
  month: CalendarDate,
  firstDayOfWeek: WeekDay = WeekDay.Sunday
): Week[] {
  const firstDayOfMonth = month.getFirstDayOfMonth();
  const lastDayOfMonth = month.getLastDayOfMonth();
  const weeks: Week[] = [];

  for (
    let date = firstDayOfMonth;
    date.isSameOrBefore(lastDayOfMonth);
    date = date.addUTCDays(1)
  ) {
    let currentWeek = weeks[weeks.length - 1];
    if (!currentWeek || date.getUTCDay() === firstDayOfWeek) {
      currentWeek = [];
      weeks.push(currentWeek);
    }
    currentWeek.push({
      date,
      dayNumber: date.getUTCDate(),
      id: date.getTime().toString(),
    });
  }
  return weeks;
}
