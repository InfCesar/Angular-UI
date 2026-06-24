import { WeekDay } from '@angular/common';
import { UiMonthHeaderPipe } from './month-header.pipe';

describe('UiMonthHeaderPipe', () => {
  const monthHeaderPipe = new UiMonthHeaderPipe();

  it('should return the original array for firstDayOfWeek = Sunday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Sunday)).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Monday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Monday)).toEqual([
      1, 2, 3, 4, 5, 6, 0,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Tuesday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Tuesday)).toEqual([
      2, 3, 4, 5, 6, 0, 1,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Wednesday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Wednesday)).toEqual([
      3, 4, 5, 6, 0, 1, 2,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Thursday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Thursday)).toEqual([
      4, 5, 6, 0, 1, 2, 3,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Friday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Friday)).toEqual([
      5, 6, 0, 1, 2, 3, 4,
    ]);
  });

  it('should return the corresponding array for firstDayOfWeek = Saturday', () => {
    expect(monthHeaderPipe.transform(WeekDay.Saturday)).toEqual([
      6, 0, 1, 2, 3, 4, 5,
    ]);
  });
});
