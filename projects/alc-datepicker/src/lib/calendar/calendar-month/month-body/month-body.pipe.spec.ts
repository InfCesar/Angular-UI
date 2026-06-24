import { Month } from "../../../types/month.type";
import { Week } from "../../../types/week.type";
import { CalendarDate } from "../../calendar-date";
import { february2024Sunday, january2024Sunday, june2024Sunday, march2024Sunday, may2024Sunday, october2024Sunday, september2024Monday, september2024Sunday, september2024Tuesday } from "./month-body.mocks";
import { UiMonthBodyPipe } from "./month-body.pipe";
import { WeekDay } from "@angular/common";

const testBuiltMonth = (builtMonth: Week[], month: CalendarDate, expectedMonthDays: number[][])=>{
  builtMonth.forEach((week, weekIndex)=>{
    testDayNumbers(week, expectedMonthDays[weekIndex]);
    testDates(week, month);
    testIDs(week, month);
  })
};

const testDayNumbers = (week: Week, dayNumbers: number[]) => {
  expect(week.length).toBe(dayNumbers.length);
  week.forEach((day, index)=> {
    expect(day.dayNumber).toBe(dayNumbers[index])
  });
};

const testDates = (week: Week, month: CalendarDate) => week.forEach((day)=> {
  const dateInBuiltWeek = new CalendarDate(month.getUTCFullYear(), month.getUTCMonth(), day.dayNumber);
  expect(day.date.isSame(dateInBuiltWeek)).toBeTrue();
});

const testIDs = (week: Week, month: CalendarDate) => week.forEach((day)=> {
  const idOfDayInBuiltWeek = new CalendarDate(month.getUTCFullYear(), month.getUTCMonth(), day.dayNumber).getTime().toString();
  expect(day.id).toBe(idOfDayInBuiltWeek);
});


describe('UiMonthBodyPipe', () => {
  const calendarPipe = new UiMonthBodyPipe();

  it('should produce a month that has a full first week', ()=>{
    const month = new CalendarDate(2024, Month.September, 1);
    const builtMonth = calendarPipe.transform(month);
    testBuiltMonth(builtMonth, month, september2024Sunday);
  });

  describe('Months with days from the previous one', ()=>{
    it('should produce a month with only 6 days for the first week', () => {
      const month = new CalendarDate(2024, Month.January, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, january2024Sunday);
    });

    it('should produce a month with only 5 days for the first week', () => {
      const month = new CalendarDate(2024, Month.October, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, october2024Sunday);
    });

    it('should produce a month with only 4 days for the first week', () => {
      const month = new CalendarDate(2024, Month.May, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, may2024Sunday);
    });

    it('should produce a month with only 3 days for the first week', () => {
      const month = new CalendarDate(2024, Month.February, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, february2024Sunday);
    });

    it('should produce a month with only 2 days for the first week', () => {
      const month = new CalendarDate(2024, Month.March, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, march2024Sunday);
    });

    it('should produce a month with only 1 day for the first week', () => {
      const month = new CalendarDate(2024, Month.June, 1);
      const builtMonth = calendarPipe.transform(month);
      testBuiltMonth(builtMonth, month, june2024Sunday);
    });
  })

  describe('First day of the week shifts', ()=>{
    it('should be able to consider Monday as the first day of the week', ()=>{
      const month = new CalendarDate(2024, Month.September, 1);
      const builtMonth = calendarPipe.transform(month, WeekDay.Monday);
      testBuiltMonth(builtMonth, month, september2024Monday);
    });

    it('should be able to consider Tuesday as the first day of the week', ()=>{
      const month = new CalendarDate(2024, Month.September, 1);
      const builtMonth = calendarPipe.transform(month, WeekDay.Tuesday);
      testBuiltMonth(builtMonth, month, september2024Tuesday);
    });
  })
});