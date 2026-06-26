import { Component, model } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarDate } from '../../calendar-date';
import { CellStateField } from '../../../types/day.type';
import { ActiveDate } from '../../../types/active-date.type';
import { AlcActiveDateDirective } from './active-date.directive';

const baseDate = new CalendarDate(2024, 0, 15);

@Component({
  template: `<button type="button" class="${CellStateField.active}">
    day
  </button>`,
})
class AlcActiveDateHostComponent extends AlcActiveDateDirective {
  activeDate = model<ActiveDate>({ date: baseDate });
}

describe('UiActiveDateDirective', () => {
  let fixture: ComponentFixture<AlcActiveDateHostComponent>;
  let component: AlcActiveDateHostComponent;
  let host: HTMLElement;

  const dispatchArrow = (key: string) =>
    host.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcActiveDateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcActiveDateHostComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('activeDate', { date: baseDate });
      fixture.detectChanges();
    });

    const navigationCases = [
      { key: 'ArrowLeft', days: -1 },
      { key: 'ArrowRight', days: 1 },
      { key: 'ArrowUp', days: -7 },
      { key: 'ArrowDown', days: 7 },
    ];

    navigationCases.forEach(({ key, days }) => {
      it(`should move the active date by ${days} day(s) on ${key}`, () => {
        dispatchArrow(key);

        expect(component.activeDate()).toEqual({
          date: baseDate.addUTCDays(days),
          autoFocus: true,
        });
      });
    });

    it('should prevent the default scrolling behaviour of arrow keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        cancelable: true,
      });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      host.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Autofocus on active date change', () => {
    let focusSpy: jasmine.Spy;

    beforeEach(() => {
      const activeOption = <HTMLElement>(
        fixture.debugElement.query(By.css(`.${CellStateField.active}`))
          .nativeElement
      );
      focusSpy = spyOn(activeOption, 'focus');
    });

    it('should focus the active option when the active date changes with autoFocus', async () => {
      fixture.componentRef.setInput('activeDate', {
        date: baseDate,
        autoFocus: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should not focus the active option when autoFocus is not set', async () => {
      fixture.componentRef.setInput('activeDate', { date: baseDate });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });
});
