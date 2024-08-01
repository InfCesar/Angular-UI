import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../calendar-date";
import { Day } from "../day.type";

@Pipe({
  name: 'dayStatus',
  pure: true,
  standalone: true,
}) export class DayStatusPipe implements PipeTransform {

  transform({date}: Day, selected?: CalendarDate[]): string {
    const isSelected = selected?.some((d)=>d.isSame(date));
    const orderedDates = selected ? [...selected].sort((d, b)=>d.isSameOrBefore(b) ? -1 : 1) : selected;

    if (orderedDates?.[0] && orderedDates[1]) {
      const inRange = date.isBefore(orderedDates[1]) && date.isAfter(orderedDates[0]);
      if(inRange) {
        return 'interval';
      }
    }

    if(isSelected) {
      return 'selected';
    }

    return 'default';
  }
}