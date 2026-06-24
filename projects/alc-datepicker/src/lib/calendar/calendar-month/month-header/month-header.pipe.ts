import { Pipe, PipeTransform } from '@angular/core';
import { WeekDay } from '@angular/common';

@Pipe({
  name: 'monthHeader',
  pure: true,
  standalone: true,
})
export class AlcMonthHeaderPipe implements PipeTransform {
  transform(firstDayOfWeek = WeekDay.Sunday) {
    const days = [...Array(7).keys()];
    return days.concat(days.splice(0, firstDayOfWeek));
  }
}
