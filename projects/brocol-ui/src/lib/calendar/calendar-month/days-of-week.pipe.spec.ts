import { DaysOfTheWeek } from "../names.type";
import { DaysOfTheWeekPipe } from "./days-of-week.pipe";

const daysMock: DaysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

describe('DaysOfTheWeekPipe', () => {
  const daysOfTheWeekPipe = new DaysOfTheWeekPipe();

  it('should return the original array if firstDayOfWeekIndex is 0', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 0)).toEqual(daysMock);
  });

  it('should return the correct array if firstDayOfWeekIndex is 1', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 1)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('should return the original array if firstDayOfWeekIndex is 2', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 2)).toEqual(['T', 'W', 'T', 'F', 'S', 'S', 'M']);
  });

  it('should return the original array if firstDayOfWeekIndex is 3', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 3)).toEqual(['W', 'T', 'F', 'S', 'S', 'M', 'T']);
  });

  it('should return the original array if firstDayOfWeekIndex is 4', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 4)).toEqual(['T', 'F', 'S', 'S', 'M', 'T', 'W']);
  });

  it('should return the original array if firstDayOfWeekIndex is 5', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 5)).toEqual(['F', 'S', 'S', 'M', 'T', 'W', 'T']);
  });

  it('should return the original array if firstDayOfWeekIndex is 6', ()=>{
    expect(daysOfTheWeekPipe.transform(daysMock, 6)).toEqual(['S', 'S', 'M', 'T', 'W', 'T', 'F']);
  });
});