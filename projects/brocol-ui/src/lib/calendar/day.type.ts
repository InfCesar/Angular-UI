import { CalendarDate } from "./calendar-date";

export type Day = {
  id: string;
  date: CalendarDate;
  dayNumber: number;
}

export enum DayState {
  none = '',
  selected = 'ui-day-state-selected',
  interval = 'ui-day-state-interval',
}