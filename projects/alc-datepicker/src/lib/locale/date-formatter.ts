import {
  computed,
  inject,
  Injectable,
  LOCALE_ID,
  signal,
  Signal,
} from '@angular/core';
import { CalendarDate } from '../calendar/calendar-date';
import { WeekName } from '../types/names.type';

/**
 * Formats calendar values with the `Intl` API using the locale from
 * {@link LOCALE_ID}.
 */
@Injectable({ providedIn: 'root' })
export class AlcDateI18n {
  private _locale = signal(inject(LOCALE_ID));
  readonly locale = this._locale.asReadonly();
  readonly weekDayNames: Signal<WeekName[]> = computed(() =>
    this.buildWeekDayNames(this.locale())
  );

  setLocale(locale: string) {
    this._locale.set(locale);
  }

  dateName(
    date: Signal<CalendarDate>,
    options: Intl.DateTimeFormatOptions
  ): Signal<string> {
    const formatter = () =>
      new Intl.DateTimeFormat(this.locale(), { ...options, timeZone: 'UTC' });
    return computed(() => formatter().format(date().getTime()));
  }

  dayLabel(date: CalendarDate): string {
    return this.dayLabelFormatter().format(date.getTime());
  }

  private dayLabelFormatter = computed(
    () =>
      new Intl.DateTimeFormat(this.locale(), {
        dateStyle: 'full',
        timeZone: 'UTC',
      })
  );

  private buildWeekDayNames(locale: string): WeekName[] {
    const long = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      timeZone: 'UTC',
    });
    const short = new Intl.DateTimeFormat(locale, {
      weekday: 'narrow',
      timeZone: 'UTC',
    });

    return Array.from({ length: 7 }, (_, day) => {
      const date = new CalendarDate(2023, 0, 1 + day);
      return {
        long: long.format(date.getTime()),
        short: short.format(date.getTime()),
      };
    });
  }
}
