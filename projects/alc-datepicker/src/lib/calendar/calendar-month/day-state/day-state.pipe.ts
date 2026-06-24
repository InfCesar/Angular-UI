import { Pipe, PipeTransform } from '@angular/core';
import { CalendarDate } from '../../calendar-date';
import { Day } from '../../../types/day.type';
import { CellState, CellStateField } from '../../../types/day.type';

@Pipe({
  name: 'dayState',
  standalone: true,
})
export class UiDayStatePipe implements PipeTransform {
  transform(
    { date }: Day,
    selected: CalendarDate[] = [],
    active?: CalendarDate
  ): CellState {
    return {
      [CellStateField.interval]: this.isDateInRange(date, selected),
      [CellStateField.selected]: this.isDateSelected(date, selected),
      [CellStateField.active]: this.isDateActive(date, active),
      [CellStateField.intervalStart]: this.isIntervalStart(date, selected),
      [CellStateField.intervalEnd]: this.isIntervalEnd(date, selected),
    };
  }

  isDateInRange(date: CalendarDate, selected: CalendarDate[]) {
    if (selected?.length > 1) {
      const inRange = selected.some((current, index) => {
        const next = selected[index + 1];
        return date.isAfter(current) && next && date.isBefore(next);
      });

      return inRange;
    }

    return false;
  }

  isDateSelected(date: CalendarDate, selected: CalendarDate[]) {
    return selected?.some((d) => d.isSame(date));
  }

  isDateActive(date: CalendarDate, active?: CalendarDate) {
    return !!active && date.isSame(active);
  }

  isIntervalStart(date: CalendarDate, selected: CalendarDate[]) {
    return selected?.length > 1 && date.isSame(selected[0]);
  }

  isIntervalEnd(date: CalendarDate, selected: CalendarDate[]) {
    return selected?.length > 1 && date.isSame(selected[selected.length - 1]);
  }
}
