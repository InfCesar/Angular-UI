import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../../calendar-date";
import { Day } from "../../../types/day.type";


@Pipe({
  name: 'dayState',
  standalone: true,
}) export class UiDayStatePipe implements PipeTransform {

  transform({date}: Day, selected: CalendarDate[] = []): DayState {
    if (selected.length > 1) {
      const inRange = selected.some((current, index)=> {
        const next = selected[index + 1];
        return date.isAfter(current) && next && date.isBefore(next);
      })

      if(inRange) {
        return DayState.interval;
      }
    }

    if(selected.some((d)=>d.isSame(date))) {
      return DayState.selected;
    }

    return DayState.none;
  }
}