
import { CalendarDate } from "../calendar-date";
import { DayState } from "../day.type";
import { DayStatePipe } from "./day-state.pipe";

describe('DayStatePipe', () => {
  const daysOfTheWeekPipe = new DayStatePipe();
  const createDayFromCalendarDate = (date: CalendarDate)=>({
    date,
    dayNumber: date.getUTCDate(),
    id: date.getTime().toString()
  })
  const dayMock = createDayFromCalendarDate(new CalendarDate(2020, 10, 10));

  it('should return DayState.none if selected dates are not provided', () => {
    expect(daysOfTheWeekPipe.transform(dayMock)).toEqual(DayState.none);
  });

  it('should return DayState.selected if the first selected date matches the processed day', () => {
    expect(daysOfTheWeekPipe.transform(dayMock, [dayMock.date])).toEqual(DayState.selected);
  });

  it('should return DayState.selected if some of the selected days matches the processed day', () => {
    expect(daysOfTheWeekPipe.transform(dayMock, [new CalendarDate(2020, 10, 1), new CalendarDate(2020, 10, 5), dayMock.date])).toEqual(DayState.selected);
  });

  it('should return DayState.interval if the processed day is between two of the selected dates (range)', () => {
    expect(daysOfTheWeekPipe.transform(dayMock, [new CalendarDate(2020, 10, 1), new CalendarDate(2020, 10, 11)])).toEqual(DayState.interval);
  });

  it('should return DayState.interval if the processed day is between two of the selected dates (multiple selection)', () => {
    expect(daysOfTheWeekPipe.transform(dayMock, [
      new CalendarDate(2020, 10, 1),
      new CalendarDate(2020, 10, 5),
      new CalendarDate(2020, 10, 15)
    ])).toEqual(DayState.interval);
  });
});