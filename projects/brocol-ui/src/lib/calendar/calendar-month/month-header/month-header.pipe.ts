import { Pipe, PipeTransform } from "@angular/core";
import { DaysOfTheWeek } from "../../names.type";

@Pipe({
  name: 'monthHeader',
  pure: true,
  standalone: true,
}) export class UiMonthHeaderPipe implements PipeTransform {

  transform(daysOfTheWeek: DaysOfTheWeek, firstDayOfWeekIndex: number) {
    const days = [...daysOfTheWeek];
    return days.concat(days.splice(0, firstDayOfWeekIndex))
  }
}