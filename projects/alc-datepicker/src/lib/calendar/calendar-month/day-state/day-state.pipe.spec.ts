import { CellStateField } from '../../../types/day.type';
import { CalendarDate } from '../../calendar-date';
import { AlcDayStatePipe } from './day-state.pipe';

describe('AlcDayStatePipe', () => {
  const dayStatePipe = new AlcDayStatePipe();
  const createDayFromCalendarDate = (date: CalendarDate) => ({
    date,
    dayNumber: date.getUTCDate(),
    id: date.getTime().toString(),
  });
  const dayMock = createDayFromCalendarDate(new CalendarDate(2020, 10, 10));

  // TODO: completar

  describe('DayStateField.selected', () => {
    it('should be false if selected dates are not provided', () => {
      expect(dayStatePipe.transform(dayMock)).toEqual(
        jasmine.objectContaining({
          [CellStateField.selected]: false,
        })
      );
    });

    it('should be true if the first selected date matches the processed day', () => {
      expect(dayStatePipe.transform(dayMock, [dayMock.date])).toEqual(
        jasmine.objectContaining({
          [CellStateField.selected]: true,
        })
      );
    });

    it('should be true if some of the selected days matches the processed day', () => {
      expect(
        dayStatePipe.transform(dayMock, [
          new CalendarDate(2020, 10, 1),
          new CalendarDate(2020, 10, 5),
          dayMock.date,
        ])
      ).toEqual(
        jasmine.objectContaining({
          [CellStateField.selected]: true,
        })
      );
    });
  });

  describe('DayStateField.interval', () => {
    it('should be false if selected dates are not provided', () => {
      expect(dayStatePipe.transform(dayMock)).toEqual(
        jasmine.objectContaining({
          [CellStateField.interval]: false,
        })
      );
    });

    it('should be false if the first selected date matches the processed day', () => {
      expect(dayStatePipe.transform(dayMock, [dayMock.date])).toEqual(
        jasmine.objectContaining({
          [CellStateField.interval]: false,
        })
      );
    });

    it('should be true if the processed day is between two of the selected dates (range)', () => {
      expect(
        dayStatePipe.transform(dayMock, [
          new CalendarDate(2020, 10, 1),
          new CalendarDate(2020, 10, 11),
        ])
      ).toEqual(
        jasmine.objectContaining({
          [CellStateField.interval]: true,
        })
      );
    });

    it('should be true  if the processed day is between two of the selected dates (multiple selection)', () => {
      expect(
        dayStatePipe.transform(dayMock, [
          new CalendarDate(2020, 10, 1),
          new CalendarDate(2020, 10, 5),
          new CalendarDate(2020, 10, 15),
        ])
      ).toEqual(
        jasmine.objectContaining({
          [CellStateField.interval]: true,
        })
      );
    });
  });

  describe('DayStateField.active', () => {
    it('should be false if active dates are not provided', () => {
      expect(dayStatePipe.transform(dayMock)).toEqual(
        jasmine.objectContaining({
          [CellStateField.active]: false,
        })
      );
    });

    it('should be false if an active date that does not match the processed day is provided', () => {
      const activeDayMock = new CalendarDate(2020, 10, 1);
      expect(dayStatePipe.transform(dayMock, [], activeDayMock)).toEqual(
        jasmine.objectContaining({
          [CellStateField.active]: false,
        })
      );
    });

    it('should be true if an active date that matches the processed day is provided', () => {
      expect(dayStatePipe.transform(dayMock, [], dayMock.date)).toEqual(
        jasmine.objectContaining({
          [CellStateField.active]: true,
        })
      );
    });
  });
});
