import { CalendarDate } from '../../calendar-date';

export const navigationCases: {
  name: string;
  key: string;
  shiftKey?: boolean;
  expected: CalendarDate;
}[] = [
  {
    name: 'previous day on ArrowLeft',
    key: 'ArrowLeft',
    expected: new CalendarDate(2024, 0, 14),
  },
  {
    name: 'next day on ArrowRight',
    key: 'ArrowRight',
    expected: new CalendarDate(2024, 0, 16),
  },
  {
    name: 'same day of the previous week on ArrowUp',
    key: 'ArrowUp',
    expected: new CalendarDate(2024, 0, 8),
  },
  {
    name: 'same day of the next week on ArrowDown',
    key: 'ArrowDown',
    expected: new CalendarDate(2024, 0, 22),
  },
  {
    name: 'first day of the week on Home',
    key: 'Home',
    expected: new CalendarDate(2024, 0, 14),
  },
  {
    name: 'last day of the week on End',
    key: 'End',
    expected: new CalendarDate(2024, 0, 20),
  },
  {
    name: 'previous month on PageUp',
    key: 'PageUp',
    expected: new CalendarDate(2023, 11, 15),
  },
  {
    name: 'next month on PageDown',
    key: 'PageDown',
    expected: new CalendarDate(2024, 1, 15),
  },
  {
    name: 'previous year on Shift+PageUp',
    key: 'PageUp',
    shiftKey: true,
    expected: new CalendarDate(2023, 0, 15),
  },
  {
    name: 'next year on Shift+PageDown',
    key: 'PageDown',
    shiftKey: true,
    expected: new CalendarDate(2025, 0, 15),
  },
];
