import { Component, input, model } from '@angular/core';
import { WeekDay } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarDate } from '../../calendar-date';
import { CellStateField } from '../../../types/day.type';
import { ActiveDate } from '../../../types/active-date.type';
import { AlcActiveDateDirective } from './active-date.directive';
import { navigationCases } from './keyboard-navigation.mock';

const baseDate = new CalendarDate(2024, 0, 15);

@Component({
  template: `<button type="button" class="${CellStateField.active}">
    day
  </button>`,
})
class AlcActiveDateHostComponent extends AlcActiveDateDirective {
  activeDate = model<ActiveDate>({ date: baseDate });
  firstDayOfWeek = input(WeekDay.Sunday);
}

describe('UiActiveDateDirective', () => {
  let fixture: ComponentFixture<AlcActiveDateHostComponent>;
  let component: AlcActiveDateHostComponent;
  let host: HTMLElement;

  const dispatchKey = (key: string, shiftKey = false) =>
    host.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        shiftKey,
        bubbles: true,
        cancelable: true,
      })
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

    navigationCases.forEach(({ name, key, shiftKey, expected }) => {
      it(`should move the active date to the ${name}`, () => {
        dispatchKey(key, shiftKey);

        expect(component.activeDate()).toEqual({
          date: expected,
          autoFocus: true,
        });
      });
    });

    describe('Home and End respect the configured first day of week', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('firstDayOfWeek', WeekDay.Monday);
        fixture.detectChanges();
      });

      it('moves to the first day (Monday) on Home', () => {
        dispatchKey('Home');

        expect(component.activeDate()).toEqual({
          date: new CalendarDate(2024, 0, 15),
          autoFocus: true,
        });
      });

      it('moves to the last day (Sunday) on End', () => {
        dispatchKey('End');

        expect(component.activeDate()).toEqual({
          date: new CalendarDate(2024, 0, 21),
          autoFocus: true,
        });
      });
    });

    it('should prevent the default scrolling behaviour of navigation keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        cancelable: true,
      });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      host.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should ignore default prevention on keys that have no navigation action', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        cancelable: true,
      });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      host.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.activeDate()).toEqual({ date: baseDate });
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
