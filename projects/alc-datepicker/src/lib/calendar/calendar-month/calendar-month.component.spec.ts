import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { september2024Sunday } from './month-body/month-body.mocks';
import { By } from '@angular/platform-browser';
import { CalendarDate } from '../calendar-date';
import { UiCalendarMonthComponent } from './calendar-month.component';
import { createMockPipe } from '../../../../../../src/mocks/mock.pipe';
import { UiMonthBodyPipe } from './month-body/month-body.pipe';
import { UiMonthHeaderPipe } from './month-header/month-header.pipe';
import { WeekDay } from '@angular/common';
import { monthNames, weekNames } from './calendar-month.data';
import { UiDayStatePipe } from './day-state/day-state.pipe';
import { Month } from '../../types/month.type';

const weekDaysMondayMock = [1, 2, 3, 4, 5, 6, 0];

const yearMock = 2024;
const monthMock = Month.September;
const dayToCalendarDate = (day: number) =>
  new CalendarDate(yearMock, monthMock, day);
const monthBodyMock = september2024Sunday.map((week) =>
  week.map((day) => ({
    dayNumber: day,
    date: dayToCalendarDate(day),
    id: dayToCalendarDate(day).getTime(),
  }))
);

describe('UiCalendarMonthComponent', () => {
  let component: UiCalendarMonthComponent;
  let fixture: ComponentFixture<UiCalendarMonthComponent>;
  let debugElement: DebugElement;
  let monthBodyTransformSpy: jasmine.Spy;
  let monthHeaderTransformSpy: jasmine.Spy;
  let dayStateTransformSpy: jasmine.Spy;

  beforeEach(async () => {
    dayStateTransformSpy = jasmine
      .createSpy()
      .and.callFake(({ date }) => `day-${date?.getUTCDate()}`);
    monthBodyTransformSpy = jasmine.createSpy().and.returnValue(monthBodyMock);
    monthHeaderTransformSpy = jasmine
      .createSpy()
      .and.returnValue(weekDaysMondayMock);

    await TestBed.configureTestingModule({
      imports: [UiCalendarMonthComponent],
    }).compileComponents();

    TestBed.overrideComponent(UiCalendarMonthComponent, {
      remove: {
        imports: [UiMonthBodyPipe, UiMonthHeaderPipe, UiDayStatePipe],
      },
      add: {
        imports: [
          createMockPipe('monthBody', monthBodyTransformSpy),
          createMockPipe('monthHeader', monthHeaderTransformSpy),
          createMockPipe('dayState', dayStateTransformSpy),
        ],
      },
    });

    fixture = TestBed.createComponent(UiCalendarMonthComponent);

    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.componentRef.setInput(
      'month',
      new CalendarDate(yearMock, monthMock, 1)
    );
    fixture.componentRef.setInput('weekDaysNames', weekNames);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Caption', () => {
    const getCaptionText = () =>
      debugElement.query(By.css('caption')).nativeElement.innerText;

    it('should render the name of the specified month with default translations', () => {
      const defaultMonthsTranslations = component.monthsNames;
      defaultMonthsTranslations.forEach((monthName, index) => {
        fixture.componentRef.setInput(
          'month',
          new CalendarDate(yearMock, index, 1)
        );
        fixture.detectChanges();
        expect(getCaptionText()).toContain(monthName);
      });
    });

    it('should render the name of the specified month with custom translations', () => {
      fixture.componentRef.setInput('monthsNames', monthNames);
      monthNames.forEach((monthName, index) => {
        fixture.componentRef.setInput(
          'month',
          new CalendarDate(yearMock, index, 1)
        );
        fixture.detectChanges();
        expect(getCaptionText()).toContain(monthName);
      });
    });

    it('should render the current year', () => {
      expect(getCaptionText()).toContain(yearMock);
    });
  });

  describe('Month header', () => {
    it("should call UiMonthHeaderPipe's transform method with the initial values from the inputs", () => {
      expect(monthHeaderTransformSpy).toHaveBeenCalledOnceWith(
        component.firstDayOfWeek
      );
    });

    it("should call UiMonthHeaderPipe's transform method when the firstDayOfWeek changes", () => {
      monthHeaderTransformSpy.calls.reset();

      fixture.componentRef.setInput('firstDayOfWeek', WeekDay.Tuesday);
      fixture.detectChanges();

      expect(monthHeaderTransformSpy).toHaveBeenCalledOnceWith(WeekDay.Tuesday);
    });

    it('should include a visually hidden long description', () => {
      const tableHeadersLong = debugElement
        .queryAll(By.css('tr th .ui-visually-hidden'))
        .map((el) => el.nativeElement.innerText.trim());
      const expectedLongdDescriptions = weekDaysMondayMock.map(
        (index) => weekNames[index].long
      );
      expect(tableHeadersLong).toEqual(expectedLongdDescriptions);
    });

    it('should include a visible abbreviation with aria-hidden set to true', () => {
      const tableHeadersShort = debugElement
        .queryAll(By.css('tr th [aria-hidden=true]:not(.ui-visually-hidden)'))
        .map((el) => el.nativeElement.innerText.trim());
      const expectedShortDescriptions = weekDaysMondayMock.map(
        (index) => weekNames[index].short
      );
      expect(tableHeadersShort).toEqual(expectedShortDescriptions);
    });
  });

  describe('Month body', () => {
    it("should call UiMonthBodyPipe's transform method with the initial values from the inputs", () => {
      expect(monthBodyTransformSpy).toHaveBeenCalledOnceWith(
        component.month,
        component.firstDayOfWeek
      );
    });

    it("should call UiMonthBodyPipe's transform method with new values from the inputs", () => {
      monthBodyTransformSpy.calls.reset();

      fixture.componentRef.setInput('firstDayOfWeek', WeekDay.Tuesday);
      fixture.detectChanges();

      expect(monthBodyTransformSpy).toHaveBeenCalledOnceWith(
        component.month,
        WeekDay.Tuesday
      );
    });

    it('should render a row for each week returned by the pipe', () => {
      const rows = debugElement.queryAll(By.css('tr.month-row'));
      expect(rows.length).toBe(monthBodyMock.length);
    });

    it('should render the returned days for each week', () => {
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
      for (
        let numOfDaysInFirstWeek = 1;
        numOfDaysInFirstWeek < 7;
        numOfDaysInFirstWeek++
      ) {
        monthBodyTransformSpy.and.returnValue([
          [...Array(numOfDaysInFirstWeek).keys()],
        ]);
        fixture.componentRef.setInput('firstDayOfWeek', numOfDaysInFirstWeek);
        fixture.detectChanges();

        const offsetCell = debugElement.query(By.css('tr td'));
        const expectedOffset = 7 - numOfDaysInFirstWeek;
        expect(offsetCell.attributes['colspan']).toBe(
          expectedOffset.toString()
        );
      }
    });

    it('should not include an offset cell if no days are from the previous month', () => {
      monthBodyTransformSpy.and.returnValue([[...Array(7).keys()]]);
      fixture.componentRef.setInput('firstDayOfWeek', 0);
      fixture.detectChanges();

      const offsetCell = debugElement.query(By.css('tr td'));
      expect(offsetCell.attributes['colspan']).toBeFalsy();
    });
  });

  // TODO: terminar tests para day cell status
  describe('Days state', () => {
    const getRenderedDays = () => debugElement.queryAll(By.css('td'));

    it('should pass each day, the selected dates and the active date to UiDayStatePipe', () => {
      const selected = [dayToCalendarDate(20)];
      const activeDate = new CalendarDate(yearMock, monthMock, 1);
      dayStateTransformSpy.calls.reset();

      fixture.componentRef.setInput('activeDate', activeDate);
      fixture.componentRef.setInput('selected', selected);
      fixture.detectChanges();

      monthBodyMock.forEach((week) => {
        week.forEach((day) => {
          expect(dayStateTransformSpy).toHaveBeenCalledWith(
            day,
            selected,
            activeDate
          );
        });
      });
    });

    it('should bind the class returned by UiDayStatePipe for each day', () => {
      getRenderedDays().forEach((day, index) => {
        expect(day.classes[`day-${index + 1}`]).toBeTrue();
      });
    });

    it('should emit selectedChange event to allow for two-way data binding', () => {
      const selectedChangeSpy = spyOn(component.selectedChange, 'emit');
      getRenderedDays()[0].triggerEventHandler('click');
      expect(selectedChangeSpy).toHaveBeenCalledOnceWith([
        dayToCalendarDate(1),
      ]);
    });
  });
});
