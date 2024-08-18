import { WeekDay } from "@angular/common";
import { WeekNames } from "../../names.type";
import { UiMonthHeaderPipe } from "./month-header.pipe";
import { weekNames } from "../calendar-month.data";

const daysMock: WeekNames = weekNames;

describe('UiMonthHeaderPipe', () => {
  const monthHeaderPipe = new UiMonthHeaderPipe();

  it('should return the original array for firstDayOfWeek = Sunday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Sunday)).toEqual(daysMock);
  });

  it('should return the corresponding array for firstDayOfWeek = Monday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Monday)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('should return the corresponding array for firstDayOfWeek = Tuesday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Tuesday)).toEqual(['T', 'W', 'T', 'F', 'S', 'S', 'M']);
  });

  it('should return the corresponding array for firstDayOfWeek = Wednesday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Wednesday)).toEqual(['W', 'T', 'F', 'S', 'S', 'M', 'T']);
  });

  it('should return the corresponding array for firstDayOfWeek = Thursday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Thursday)).toEqual(['T', 'F', 'S', 'S', 'M', 'T', 'W']);
  });

  it('should return the corresponding array for firstDayOfWeek = Friday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Friday)).toEqual(['F', 'S', 'S', 'M', 'T', 'W', 'T']);
  });

  it('should return the corresponding array for firstDayOfWeek = Saturday', ()=>{
    expect(monthHeaderPipe.transform(daysMock, WeekDay.Saturday)).toEqual(['S', 'S', 'M', 'T', 'W', 'T', 'F']);
  });
});