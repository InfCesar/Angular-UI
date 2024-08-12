import { Pipe, PipeTransform } from "@angular/core";
import { WeekNames } from "../../names.type";
import { WeekDay } from "@angular/common";

@Pipe({
  name: 'monthHeader',
  pure: true,
  standalone: true,
}) export class UiMonthHeaderPipe implements PipeTransform {

  transform(daysOfTheWeek: WeekNames, firstDayOfWeek = WeekDay.Sunday) {
    const days = [...daysOfTheWeek];
    return days.concat(days.splice(0, firstDayOfWeek))
  }
}