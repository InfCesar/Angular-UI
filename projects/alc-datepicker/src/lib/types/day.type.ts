import { CalendarDate } from "../calendar/calendar-date";

export type Day = {
  id: string;
  date: CalendarDate;
  dayNumber: number;
}

export enum CellStateField {
  active = 'ui-day-state-active',
  selected = 'ui-day-state-selected',
  interval = 'ui-day-state-interval',
  intervalStart = 'ui-day-state-interval-start',
  intervalEnd = 'ui-day-state-interval-end',
}

export type CellState = {
  [key in CellStateField]: boolean;
};