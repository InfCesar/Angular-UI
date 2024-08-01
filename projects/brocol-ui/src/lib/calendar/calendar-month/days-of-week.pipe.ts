import { Pipe, PipeTransform } from "@angular/core";
import { DaysOfTheWeek} from "../calendar.model";

@Pipe({
  name: 'daysOfTheWeek',
  pure: true,
  standalone: true,
}) export class DaysOfTheWeekPipe implements PipeTransform {

  transform(daysOfTheWeek: DaysOfTheWeek, firstDayOfWeekIndex: number) {
    const days = [...daysOfTheWeek];
    return days.concat(days.splice(0, firstDayOfWeekIndex))
  }
}