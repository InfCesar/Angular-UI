import { CalendarDate } from '../calendar/calendar-date';

/** Builds the string a mocked formatter returns for a given locale/options/date. */
export const formatStub = (
  locale: string,
  options: Intl.DateTimeFormatOptions,
  date: CalendarDate | number
): string => {
  const time = typeof date === 'number' ? date : date.getTime();
  const { weekday, dateStyle, month } = options;
  return `${locale}|${JSON.stringify({ weekday, dateStyle, month })}:${time}`;
};

export const mockDateTimeFormat = function (
  locale: string,
  options?: Intl.DateTimeFormatOptions
) {
  return {
    format: (value: number) => formatStub(locale, options ?? {}, value),
  };
} as typeof Intl.DateTimeFormat;
