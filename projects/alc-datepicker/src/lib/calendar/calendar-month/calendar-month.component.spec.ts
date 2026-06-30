import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, DebugElement, Signal } from '@angular/core';
import { september2024Sunday } from './month-body/month-body.mocks';
import { By } from '@angular/platform-browser';
import { CalendarDate } from '../calendar-date';
import { AlcCalendarMonthComponent } from './calendar-month.component';
import { createMockPipe } from '../../../../../../src/mocks/mock.pipe';
import { createMockService } from '../../../../../../src/mocks/mock.service';
import { AlcMonthHeaderPipe } from './month-header/month-header.pipe';
import { WeekDay } from '@angular/common';
import { AlcDayStatePipe } from './day-state/day-state.pipe';
import { Month } from '../../types/month.type';
import { AlcDateI18n } from '../../locale/date-formatter';
import { WeekName } from '../../types/names.type';

const weekDaysMondayMock = [1, 2, 3, 4, 5, 6, 0];

const yearMock = 2024;
const monthMock = Month.September;
const dayToCalendarDate = (day: number) =>
  new CalendarDate(yearMock, monthMock, day);
const monthBodyMock = september2024Sunday.map((week) =>
  week.map((day) => ({
    dayNumber: day,
    date: dayToCalendarDate(day),
    id: dayToCalendarDate(day).getTime().toString(),
  }))
);

const weekDayNamesMock: WeekName[] = Array.from({ length: 7 }, (_, index) => ({
  long: `weekday-long-${index}`,
  short: `weekday-short-${index}`,
}));

describe('AlcCalendarMonthComponent', () => {
  let component: AlcCalendarMonthComponent;
  let fixture: ComponentFixture<AlcCalendarMonthComponent>;
  let debugElement: DebugElement;
  let formatterMock: jasmine.SpyObj<AlcDateI18n>;
  let monthHeaderTransformSpy: jasmine.Spy;
  let dayStateTransformSpy: jasmine.Spy;

  beforeEach(async () => {
    dayStateTransformSpy = jasmine
      .createSpy()
      .and.callFake(({ date }) => `day-${date?.getUTCDate()}`);
    monthHeaderTransformSpy = jasmine
      .createSpy()
      .and.returnValue(weekDaysMondayMock);

    formatterMock = createMockService(AlcDateI18n, 'weekDayNames');
    formatterMock.weekDayNames.and.returnValue(weekDayNamesMock);
    formatterMock.dateName.and.callFake((date: Signal<CalendarDate>) =>
      computed(() => `month-${date().getUTCMonth()}`)
    );
    formatterMock.dayLabel.and.callFake(
      (date: CalendarDate) => `label-${date.getTime()}`
    );

    await TestBed.configureTestingModule({
      imports: [AlcCalendarMonthComponent],
      providers: [{ provide: AlcDateI18n, useValue: formatterMock }],
    }).compileComponents();

    TestBed.overrideComponent(AlcCalendarMonthComponent, {
      remove: {
        imports: [AlcMonthHeaderPipe, AlcDayStatePipe],
      },
      add: {
        imports: [
          createMockPipe('monthHeader', monthHeaderTransformSpy),
          createMockPipe('dayState', dayStateTransformSpy),
        ],
      },
    });

    fixture = TestBed.createComponent(AlcCalendarMonthComponent);

    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.componentRef.setInput(
      'month',
      new CalendarDate(yearMock, monthMock, 1)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Caption', () => {
    const getCaptionText = () =>
      debugElement.query(By.css('caption')).nativeElement.innerText;

    it('should render the month name returned by the formatter for the specified month', () => {
      [...Array(12).keys()].forEach((index) => {
        fixture.componentRef.setInput(
          'month',
          new CalendarDate(yearMock, index, 1)
        );
        fixture.detectChanges();
        expect(getCaptionText()).toContain(`month-${index}`);
      });
    });

    it('should render the current year', () => {
      expect(getCaptionText()).toContain(yearMock);
    });
  });

  describe('Month header', () => {
    it("should call AlcMonthHeaderPipe's transform method with the initial values from the inputs", () => {
      expect(monthHeaderTransformSpy).toHaveBeenCalledOnceWith(
        component.firstDayOfWeek()
      );
    });

    it("should call AlcMonthHeaderPipe's transform method when the firstDayOfWeek changes", () => {
      monthHeaderTransformSpy.calls.reset();

      fixture.componentRef.setInput('firstDayOfWeek', WeekDay.Tuesday);
      fixture.detectChanges();

      expect(monthHeaderTransformSpy).toHaveBeenCalledOnceWith(WeekDay.Tuesday);
    });

    it('should include a visually hidden long description', () => {
      const tableHeadersLong = debugElement
        .queryAll(By.css('tr th .alc-visually-hidden'))
        .map((el) => el.nativeElement.innerText.trim());
      const expectedLongdDescriptions = weekDaysMondayMock.map(
        (index) => weekDayNamesMock[index].long
      );
      expect(tableHeadersLong).toEqual(expectedLongdDescriptions);
    });

    it('should include a visible abbreviation with aria-hidden set to true', () => {
      const tableHeadersShort = debugElement
        .queryAll(By.css('tr th [aria-hidden=true]:not(.alc-visually-hidden)'))
        .map((el) => el.nativeElement.innerText.trim());
      const expectedShortDescriptions = weekDaysMondayMock.map(
        (index) => weekDayNamesMock[index].short
      );
      expect(tableHeadersShort).toEqual(expectedShortDescriptions);
    });
  });

  describe('Month body', () => {
    it('should render a row for each week in the month', () => {
      const rows = debugElement.queryAll(By.css('tr.month-row'));
      expect(rows.length).toBe(monthBodyMock.length);
    });

    it('should render the days for each week', () => {
      const rows = debugElement.queryAll(By.css('tr.month-row'));
      rows.forEach((row, index) => {
        const cellsInRow = row
          .queryAll(By.css('td'))
          .map((el) => el.nativeElement.innerText);
        const dayNumbers = monthBodyMock[index].map((day) =>
          day.dayNumber.toString()
        );
        expect(cellsInRow).toEqual(dayNumbers);
      });
    });

    it('should include an offset cell corresponding to the days from the previous month', () => {
      const offsetByMonth: [Month, number][] = [
        [Month.January, 1],
        [Month.October, 2],
        [Month.May, 3],
        [Month.February, 4],
        [Month.March, 5],
        [Month.June, 6],
      ];

      offsetByMonth.forEach(([month, expectedOffset]) => {
        fixture.componentRef.setInput(
          'month',
          new CalendarDate(2024, month, 1)
        );
        fixture.detectChanges();

        const offsetCell = debugElement.query(By.css('tr.month-row td'));
        expect(offsetCell.attributes['colspan']).toBe(
          expectedOffset.toString()
        );
      });
    });

    it('should not include an offset cell if no days are from the previous month', () => {
      const firstCell = debugElement.query(By.css('tr.month-row td'));
      expect(firstCell.attributes['colspan']).toBeFalsy();
    });
  });

  describe('Days state', () => {
    const getRenderedDays = () => debugElement.queryAll(By.css('td'));

    it('should pass each day, the selected dates and the active date to AlcDayStatePipe', () => {
      const selected = [dayToCalendarDate(20)];
      const activeDateValue = new CalendarDate(yearMock, monthMock, 1);
      dayStateTransformSpy.calls.reset();

      fixture.componentRef.setInput('activeDate', { date: activeDateValue });
      fixture.componentRef.setInput('selected', selected);
      fixture.detectChanges();

      monthBodyMock.forEach((week) => {
        week.forEach((day) => {
          expect(dayStateTransformSpy).toHaveBeenCalledWith(
            day,
            selected,
            activeDateValue
          );
        });
      });
    });

    it('should bind the class returned by AlcDayStatePipe for each day', () => {
      getRenderedDays().forEach((day, index) => {
        expect(day.classes[`day-${index + 1}`]).toBeTrue();
      });
    });

    it('should update the selected model when a day is clicked', () => {
      getRenderedDays()[0].triggerEventHandler('click');

      expect(component.selected()).toEqual([dayToCalendarDate(1)]);
    });

    ['keydown.space', 'keydown.enter'].forEach((eventName) => {
      it(`should select the day and prevent default on ${eventName}`, () => {
        const event = jasmine.createSpyObj<Event>('event', ['preventDefault']);

        getRenderedDays()[0].triggerEventHandler(eventName, event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.selected()).toEqual([dayToCalendarDate(1)]);
      });
    });
  });
});
