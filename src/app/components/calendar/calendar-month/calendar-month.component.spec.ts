import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UICalendarMonthComponent } from "./calendar-month.component";
import { DebugElement } from "@angular/core";
import { CalendarBuilderPipe } from "./calendar-builder.pipe";
import { DaysOfTheWeekPipe } from "./days-of-week.pipe";
import { createMockPipe } from "../../../../mocks/mock.pipe";
import { september2024Sunday } from "./calendar-builder.mocks";
import { By } from "@angular/platform-browser";

const weekDaysMondayMock = ['M', 'T', 'W', 'T', 'F', 'S','S'];
const weekDaysTuesdayMock = ['T', 'W', 'T', 'F', 'S','S', 'M'];
const calendarBuilderMock = september2024Sunday.map((week)=>week.map((day)=>({
  dayNumber: day
})));

describe('UICalendarMonthComponent', () => {
  let component: UICalendarMonthComponent;
  let fixture: ComponentFixture<UICalendarMonthComponent>;
  let debugElement: DebugElement;
  let calendarBuilderTransformSpy: jasmine.Spy;
  let daysOfTheWeekTransformSpy: jasmine.Spy;

  beforeEach(async () => {
    calendarBuilderTransformSpy = jasmine.createSpy().and.returnValue(calendarBuilderMock);
    daysOfTheWeekTransformSpy = jasmine.createSpy().and.returnValue(weekDaysMondayMock);

    await TestBed.configureTestingModule({
      imports: [UICalendarMonthComponent],
    }).compileComponents();

    TestBed.overrideComponent(UICalendarMonthComponent, {
      remove: {
        imports: [DaysOfTheWeekPipe, CalendarBuilderPipe]
      },
      add: {
        imports: [
          createMockPipe('daysOfTheWeek', daysOfTheWeekTransformSpy),
          createMockPipe('calendarBuilder', calendarBuilderTransformSpy)]
      }
    })
  
    fixture = TestBed.createComponent(UICalendarMonthComponent);

    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  
      fixture.componentRef.setInput('monthIndex', 1);
      fixture.componentRef.setInput('year', 2020);
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
        fixture.componentRef.setInput('monthIndex', numOfDaysInFirstWeek); // Trigger pipe transform
        fixture.detectChanges();
        const offsetCell = debugElement.query(By.css('tr td'));
        const expectedOffset = (7 - numOfDaysInFirstWeek);
        expect(offsetCell.attributes['colspan']).toBe(expectedOffset.toString());
      }
    });
  })
});
