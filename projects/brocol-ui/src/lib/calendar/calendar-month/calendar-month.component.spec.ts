import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { CalendarBuilderPipe } from "./calendar-builder.pipe";
import { DaysOfTheWeekPipe } from "./days-of-week.pipe";
import { september2024Sunday } from "./calendar-builder.mocks";
import { By } from "@angular/platform-browser";
import { CalendarDate } from "../calendar-date";
import { UI_CALENDAR_SELECTION_STRATEGY } from "../selection-strategy";
import { UiCalendarMonthComponent } from "./calendar-month.component";
import { createMockPipe } from "../../../../../../src/mocks/mock.pipe";

const year = 2020;
const monthIndex = 1;
const weekDaysMondayMock = ['M', 'T', 'W', 'T', 'F', 'S','S'];
const weekDaysTuesdayMock = ['T', 'W', 'T', 'F', 'S','S', 'M'];
const monthNamesMock = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dayToCalendarDate = (day: number) => new CalendarDate(year, monthIndex, day)
const calendarBuilderMock = september2024Sunday.map((week)=>week.map((day)=>({
  dayNumber: day,
  date: dayToCalendarDate(day)
})));

describe('UiCalendarMonthComponent', () => {
  let component: UiCalendarMonthComponent;
  let fixture: ComponentFixture<UiCalendarMonthComponent>;
  let debugElement: DebugElement;
  let calendarBuilderTransformSpy: jasmine.Spy;
  let daysOfTheWeekTransformSpy: jasmine.Spy;

  beforeEach(async () => {
    calendarBuilderTransformSpy = jasmine.createSpy().and.returnValue(calendarBuilderMock);
    daysOfTheWeekTransformSpy = jasmine.createSpy().and.returnValue(weekDaysMondayMock);

    await TestBed.configureTestingModule({
      imports: [UiCalendarMonthComponent],
    }).compileComponents();

    TestBed.overrideComponent(UiCalendarMonthComponent, {
      remove: {
        imports: [DaysOfTheWeekPipe, CalendarBuilderPipe]
      },
      add: {
        imports: [
          createMockPipe('daysOfTheWeek', daysOfTheWeekTransformSpy),
          createMockPipe('calendarBuilder', calendarBuilderTransformSpy)]
      }
    })
  
    fixture = TestBed.createComponent(UiCalendarMonthComponent);

    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.componentRef.setInput('monthIndex', monthIndex);
    fixture.componentRef.setInput('year', year);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Caption', ()=>{
    const getCaptionText = ()=>debugElement.query(By.css('caption')).nativeElement.innerText;

    it('should render the current name of the month with default translations', ()=>{
      const defaultMonthsTranslations = component.monthsNames;
      defaultMonthsTranslations.forEach((monthName, index)=>{
        fixture.componentRef.setInput('monthIndex', index);
        fixture.detectChanges();
        expect(getCaptionText()).toContain(monthName);
      })
    });

    it('should render the current name of the month with custom translations', ()=>{
      fixture.componentRef.setInput('monthsNames', monthNamesMock);
      monthNamesMock.forEach((monthName, index)=>{
        fixture.componentRef.setInput('monthIndex', index);
        fixture.detectChanges();
        expect(getCaptionText()).toContain(monthName);
      })
    });

    it('should render the current year', () => {
      fixture.componentRef.setInput('year', 2020);
      fixture.componentRef.setInput('monthIndex', 3);
      fixture.detectChanges();
      expect(getCaptionText()).toContain(2020);
    });

    it('should render the previous year', ()=> {
      fixture.componentRef.setInput('year', 2020);
      fixture.componentRef.setInput('monthIndex', -1);
      fixture.detectChanges();
      expect(getCaptionText()).toContain(2019);
    });

    it('should render the next year', ()=> {
      fixture.componentRef.setInput('year', 2020);
      fixture.componentRef.setInput('monthIndex', 12);
      fixture.detectChanges();
      expect(getCaptionText()).toContain(2021);
    });
  });

  describe('Month header', ()=>{
    it('should call DaysOfTheWeekPipe\'s transform method with the initial values from the inputs', ()=>{
      expect(daysOfTheWeekTransformSpy).toHaveBeenCalledOnceWith(
        component.weekDaysNames,
        component.firstDayOfWeek
      );
    });

    it('should call DaysOfTheWeekPipe\'s transform method with new values from the inputs', ()=>{
      daysOfTheWeekTransformSpy.calls.reset();
  
      fixture.componentRef.setInput('weekDaysNames', weekDaysTuesdayMock);
      fixture.componentRef.setInput('firstDayOfWeek', 2);
      fixture.detectChanges();
  
      expect(daysOfTheWeekTransformSpy).toHaveBeenCalledOnceWith(
        weekDaysTuesdayMock,
        2
      );
    });

    it('should render a th for each value returned by the pipe', ()=>{
      const tableHeaders = debugElement.queryAll(By.css('tr th')).map((th)=>th.nativeElement.innerText);
      expect(tableHeaders).toEqual(weekDaysMondayMock);
    })
  });

  describe('Month body', ()=>{
    it('should call CalendarBuilderPipe\'s transform method with the initial values from the inputs', ()=>{     
      expect(calendarBuilderTransformSpy).toHaveBeenCalledOnceWith(
        component.monthIndex,
        component.year,
        component.firstDayOfWeek
      );
    });
  
    it('should call CalendarBuilderPipe\'s transform method with new values from the inputs', ()=>{
      calendarBuilderTransformSpy.calls.reset();
  
      fixture.componentRef.setInput('firstDayOfWeek', 2);
      fixture.detectChanges();
  
      expect(calendarBuilderTransformSpy).toHaveBeenCalledOnceWith(
        1,
        2020,
        2
      );
    });

    it('should render a row for each week returned by the pipe', ()=>{
      const rows = debugElement.queryAll(By.css('tr.month-row'));
      expect(rows.length).toBe(calendarBuilderMock.length);
    });

    it('should render the returned days for each week', ()=>{
      const rows = debugElement.queryAll(By.css('tr.month-row'));
      rows.forEach((row, index)=>{
        const cellsInRow = row.queryAll(By.css('td')).map((el)=>el.nativeElement.innerText);
        const dayNumbers = calendarBuilderMock[index].map((day)=>day.dayNumber.toString());
        expect(cellsInRow).toEqual(dayNumbers);
      })
    });

    it('should include an empty cell with an offset corresponding to the days from the previous month', ()=>{
      for(let numOfDaysInFirstWeek = 1; numOfDaysInFirstWeek < 7; numOfDaysInFirstWeek ++) {
        calendarBuilderTransformSpy.and.returnValue([[...Array(numOfDaysInFirstWeek).keys()]]);
        fixture.componentRef.setInput('monthIndex', numOfDaysInFirstWeek+1000); // Trigger pipe transform
        fixture.detectChanges();
        const offsetCell = debugElement.query(By.css('tr td'));
        const expectedOffset = (7 - numOfDaysInFirstWeek);
        expect(offsetCell.attributes['colspan']).toBe(expectedOffset.toString());
      }
    });
  });

  describe('Days selection', () => {
    it('days should not be selected by default', ()=>{
      const selectedDays = debugElement.queryAll(By.css('td button.selected'));
      expect(selectedDays.length).toBe(0);
    });

    it('should mark a day as selected on click by default', ()=> {
      const renderedDays = debugElement.queryAll(By.css('td button'));
      renderedDays[0].triggerEventHandler('click');
      fixture.detectChanges();
      expect(renderedDays[0].classes['selected']).toBeTrue();
    });

    it('should use the provided selection strategy to determine the new selection', ()=>{
      const injectedStrategy = TestBed.inject(UI_CALENDAR_SELECTION_STRATEGY);
      const onSelectSpy = spyOn(injectedStrategy,'onSelect');
      const newSelectionDay = 4;
      const renderedDays = debugElement.queryAll(By.css('td button'));

      onSelectSpy.and.returnValue([dayToCalendarDate(newSelectionDay)])
      renderedDays[0].triggerEventHandler('click');
      fixture.detectChanges();
  
      expect(onSelectSpy).toHaveBeenCalledTimes(1);
      expect(renderedDays[newSelectionDay - 1].classes['selected']).toBeTrue();
    })
  });
});
