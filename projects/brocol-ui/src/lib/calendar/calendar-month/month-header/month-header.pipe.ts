import { Pipe, PipeTransform } from "@angular/core";
import { DaysOfTheWeekNames } from "../../names.type";

@Pipe({
  name: 'monthHeader',
  pure: true,
  standalone: true,
}) export class UiMonthHeaderPipe implements PipeTransform {

  transform(daysOfTheWeek: DaysOfTheWeekNames, firstDayOfWeekIndex: number) {
    const days = [...daysOfTheWeek];
    return days.concat(days.splice(0, firstDayOfWeekIndex))
  }
}