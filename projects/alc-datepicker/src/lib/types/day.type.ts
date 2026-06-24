import { CalendarDate } from '../calendar/calendar-date';

export type Day = {
  id: string;
  date: CalendarDate;
  dayNumber: number;
};

export enum CellStateField {
  active = 'alc-day-state-active',
  selected = 'alc-day-state-selected',
  interval = 'alc-day-state-interval',
  intervalStart = 'alc-day-state-interval-start',
  intervalEnd = 'alc-day-state-interval-end',
}

export type CellState = {
  [key in CellStateField]: boolean;
};
