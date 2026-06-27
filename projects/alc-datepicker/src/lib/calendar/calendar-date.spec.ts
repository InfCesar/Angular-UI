import { WeekDay } from '@angular/common';
import { CalendarDate } from './calendar-date';

describe('CalendarDate', () => {
  const ymd = (date: CalendarDate) => [
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ];

  describe('addUTCMonths', () => {
    it('keeps the day when it exists in the target month', () => {
      expect(ymd(new CalendarDate(2024, 0, 15).addUTCMonths(1))).toEqual([
        2024, 1, 15,
      ]);
    });

    it('clamps to the last day when the target month is shorter', () => {
      expect(ymd(new CalendarDate(2024, 0, 31).addUTCMonths(1))).toEqual([
        2024, 1, 29,
      ]);
    });

    it('clamps when moving backwards into a shorter month', () => {
      expect(ymd(new CalendarDate(2024, 2, 31).addUTCMonths(-1))).toEqual([
        2024, 1, 29,
      ]);
    });

    it('rolls over the year boundary', () => {
      expect(ymd(new CalendarDate(2024, 11, 31).addUTCMonths(1))).toEqual([
        2025, 0, 31,
      ]);
    });
  });

  describe('addUTCYears', () => {
    it('keeps the day when it exists in the target month', () => {
      expect(ymd(new CalendarDate(2024, 5, 15).addUTCYears(1))).toEqual([
        2025, 5, 15,
      ]);
    });

    it('clamps Feb 29 to Feb 28 in a non-leap year', () => {
      expect(ymd(new CalendarDate(2024, 1, 29).addUTCYears(1))).toEqual([
        2025, 1, 28,
      ]);
    });
  });

  describe('getFirstDayOfWeek', () => {
    const monday = new CalendarDate(2024, 0, 15);

    it('returns the start of the week for the configured first day', () => {
      expect(ymd(monday.getFirstDayOfWeek(WeekDay.Sunday))).toEqual([
        2024, 0, 14,
      ]);
      expect(ymd(monday.getFirstDayOfWeek(WeekDay.Monday))).toEqual([
        2024, 0, 15,
      ]);
      expect(ymd(monday.getFirstDayOfWeek(WeekDay.Saturday))).toEqual([
        2024, 0, 13,
      ]);
    });

    it('crosses into the previous month when the week starts there', () => {
      const firstOfFebruary = new CalendarDate(2024, 1, 1);

      expect(ymd(firstOfFebruary.getFirstDayOfWeek(WeekDay.Sunday))).toEqual([
        2024, 0, 28,
      ]);
    });
  });

  describe('getLastDayOfWeek', () => {
    const monday = new CalendarDate(2024, 0, 15);

    it('returns the end of the week for the configured first day', () => {
      expect(ymd(monday.getLastDayOfWeek(WeekDay.Sunday))).toEqual([
        2024, 0, 20,
      ]);
      expect(ymd(monday.getLastDayOfWeek(WeekDay.Monday))).toEqual([
        2024, 0, 21,
      ]);
      expect(ymd(monday.getLastDayOfWeek(WeekDay.Saturday))).toEqual([
        2024, 0, 19,
      ]);
    });

    it('crosses into the next month when the week ends there', () => {
      const lastTuesday = new CalendarDate(2024, 0, 30);

      expect(ymd(lastTuesday.getLastDayOfWeek(WeekDay.Sunday))).toEqual([
        2024, 1, 3,
      ]);
    });
  });
});
