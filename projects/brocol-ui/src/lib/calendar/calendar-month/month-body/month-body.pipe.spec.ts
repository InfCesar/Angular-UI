import { CalendarDate } from "../../calendar-date";
import { february2024Sunday, january2024Sunday, june2024Sunday, march2024Sunday, may2024Sunday, october2024Sunday, september2024Monday, september2024Sunday, september2024Tuesday } from "./month-body.mocks";
import { Week } from "../../week.type";
import { UiMonthBodyPipe } from "./month-body.pipe";

const year = 2024;

const testDayNumbers = (week: Week, dayNumbers: number[]) => {
  expect(week.length).toBe(dayNumbers.length);
  week.forEach((day, index)=> {
    expect(day.dayNumber).toBe(dayNumbers[index])
  });
}

const testDates = (week: Week, monthIndex: number, year: number) => week.forEach((day)=> {
  const dateMock = new CalendarDate(year, monthIndex, day.dayNumber);
  expect(day.date.toISOString()).toBe(dateMock.toISOString());
});

const testIDs = (week: Week, monthIndex: number, year: number) => week.forEach((day)=> {
  const idMock = new CalendarDate(year, monthIndex, day.dayNumber).getTime().toString();
  expect(day.id).toBe(idMock);
});

describe('UiMonthBodyPipe', () => {
  const calendarPipe = new UiMonthBodyPipe();

  it('should produce a month that has a full first week', ()=>{
    const monthIndex = 8;
    const builtMonth = calendarPipe.transform(monthIndex, year, 0);

    builtMonth.forEach((week, weekIndex)=>{
      testDayNumbers(week, september2024Sunday[weekIndex]);
      testDates(week, monthIndex, year);
      testIDs(week, monthIndex, year);
    });
  });

  describe('Months with days from the previous one', ()=>{
    it('should produce a month with only 6 days for the first week', () => {
      const monthIndex = 0;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, january2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      })
    });

    it('should produce a month with only 5 days for the first week', () => {
      const monthIndex = 9;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, october2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      })
    });

    it('should produce a month with only 4 days for the first week', () => {
      const monthIndex = 4;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, may2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });

    it('should produce a month with only 3 days for the first week', () => {
      const monthIndex = 1;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, february2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });

    it('should produce a month with only 2 days for the first week', () => {
      const monthIndex = 2;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, march2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });

    it('should produce a month with only 1 day for the first week', () => {
      const monthIndex = 5;
      const builtMonth = calendarPipe.transform(monthIndex, year, 0);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, june2024Sunday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });
  })

  describe('First day of the week shifts', ()=>{
    it('should be able to consider monday as the first day of the week', ()=>{
      const monthIndex = 8;
      const builtMonth = calendarPipe.transform(monthIndex, year, 1);
  
      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, september2024Monday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });

    it('should be able to consider tuesday as the first day of the week', ()=>{
      const monthIndex = 8;
      const builtMonth = calendarPipe.transform(monthIndex, year, 2);

      builtMonth.forEach((week, weekIndex)=>{
        testDayNumbers(week, september2024Tuesday[weekIndex]);
        testDates(week, monthIndex, year);
        testIDs(week, monthIndex, year);
      });
    });
  })
});