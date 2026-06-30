import { TestBed } from '@angular/core/testing';
import { LOCALE_ID, signal } from '@angular/core';
import { AlcDateI18n } from './date-formatter';
import { CalendarDate } from '../calendar/calendar-date';
import { mockDateTimeFormat, formatStub } from './date-formatter.mock';

const sunday = new CalendarDate(2023, 0, 1);
const saturday = new CalendarDate(2023, 0, 7);
const localeMock = 'it-IT';

describe('AlcDateFormatter', () => {
  describe('formatting', () => {
    let formatter: AlcDateI18n;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: LOCALE_ID,
            useValue: localeMock,
          },
        ],
      });
      formatter = TestBed.inject(AlcDateI18n);
      spyOn(Intl, 'DateTimeFormat').and.callFake(mockDateTimeFormat);
    });

    describe('weekDayNames', () => {
      it('should format week days in long and narrow formats', () => {
        const names = formatter.weekDayNames();
        expect(names.length).toBe(7);
        expect(names[0]).toEqual({
          long: formatStub(localeMock, { weekday: 'long' }, sunday),
          short: formatStub(localeMock, { weekday: 'narrow' }, sunday),
        });
        expect(names[6]).toEqual({
          long: formatStub(localeMock, { weekday: 'long' }, saturday),
          short: formatStub(localeMock, { weekday: 'narrow' }, saturday),
        });
      });

      it('should be updated when the locale changes', () => {
        expect(formatter.weekDayNames()[0].long).toBe(
          formatStub(localeMock, { weekday: 'long' }, sunday)
        );

        formatter.setLocale('es-ES');

        expect(formatter.weekDayNames()[0].long).toBe(
          formatStub('es-ES', { weekday: 'long' }, sunday)
        );
      });
    });

    describe('dayLabel', () => {
      it('should format the date as a full UTC date for the current locale', () => {
        const date = new CalendarDate(2024, 0, 15);

        const result = formatter.dayLabel(date);
        expect(result).toBe(
          formatStub(localeMock, { dateStyle: 'full' }, date)
        );
      });

      it('should be updated when the locale changes', () => {
        const date = new CalendarDate(2024, 0, 15);
        expect(formatter.dayLabel(date)).toBe(
          formatStub(localeMock, { dateStyle: 'full' }, date)
        );

        formatter.setLocale('es-ES');

        expect(formatter.dayLabel(date)).toBe(
          formatStub('es-ES', { dateStyle: 'full' }, date)
        );
      });
    });

    describe('dateName', () => {
      it('should format the date with the given options in UTC for the current locale', () => {
        const date = signal(new CalendarDate(2024, 5, 15));
        const result = formatter.dateName(date, { month: 'long' })();
        expect(result).toBe(formatStub(localeMock, { month: 'long' }, date()));
      });

      it('should be updated when the locale changes', () => {
        const date = signal(new CalendarDate(2024, 5, 15));
        const name = formatter.dateName(date, { month: 'long' });
        expect(name()).toBe(formatStub(localeMock, { month: 'long' }, date()));
        formatter.setLocale('es-ES');
        expect(name()).toBe(formatStub('es-ES', { month: 'long' }, date()));
      });
    });
  });
});
