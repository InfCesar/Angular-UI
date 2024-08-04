import { DaysOfTheWeekNames } from "../../names.type";
import { UiMonthHeaderPipe } from "./month-header.pipe";

const daysMock: DaysOfTheWeekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

describe('UiMonthHeaderPipe', () => {
  const monthHeaderPipe = new UiMonthHeaderPipe();

  it('should return the original array for firstDayOfWeekIndex = 0', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 0)).toEqual(daysMock);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 1', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 1)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 2', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 2)).toEqual(['T', 'W', 'T', 'F', 'S', 'S', 'M']);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 3', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 3)).toEqual(['W', 'T', 'F', 'S', 'S', 'M', 'T']);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 4', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 4)).toEqual(['T', 'F', 'S', 'S', 'M', 'T', 'W']);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 5', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 5)).toEqual(['F', 'S', 'S', 'M', 'T', 'W', 'T']);
  });

  it('should return the corresponding array for firstDayOfWeekIndex = 6', ()=>{
    expect(monthHeaderPipe.transform(daysMock, 6)).toEqual(['S', 'S', 'M', 'T', 'W', 'T', 'F']);
  });
});