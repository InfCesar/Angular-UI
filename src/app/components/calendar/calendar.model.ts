import { CalendarDate } from "./calendar-date";

export type Day = {
  id: string;
  date: CalendarDate;
  dayNumber: number;
};
export type Week = Day[];
export type DaysOfTheWeek = [string, string, string, string, string, string, string];