import { Pipe, PipeTransform } from "@angular/core";
import { CalendarDate } from "../../calendar-date";
import { Day, DayState } from "../../day.type";


@Pipe({
  name: 'dayState',
  standalone: true,
}) export class UiDayStatePipe implements PipeTransform {

  transform({date}: Day, selected: CalendarDate[] = []): DayState {
    if (selected.length > 1) {
      const inRange = selected.some((_, index)=> date.isAfter(selected[index]) && date.isBefore(selected[index + 1]))
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