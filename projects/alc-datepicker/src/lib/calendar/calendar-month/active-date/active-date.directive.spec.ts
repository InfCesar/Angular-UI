import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarDate } from '../../calendar-date';
import { CellStateField } from '../../../types/day.type';
import { AlcActiveDateDirective } from './active-date.directive';

@Component({
  template: `<button type="button" class="${CellStateField.active}">
    day
  </button>`,
})
class AlcActiveDateHostComponent extends AlcActiveDateDirective {}

describe('UiActiveDateDirective', () => {
  let fixture: ComponentFixture<AlcActiveDateHostComponent>;
  let component: AlcActiveDateHostComponent;
  let host: HTMLElement;

  const baseDate = new CalendarDate(2024, 0, 15);

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
    let activeDateChangeSpy: jasmine.Spy;

    beforeEach(() => {
      fixture.componentRef.setInput('activeDate', { date: baseDate });
      fixture.detectChanges();
      activeDateChangeSpy = spyOn(component.activeDateChange, 'emit');
    });

    it('should emit the previous day on ArrowLeft', () => {
      dispatchArrow('ArrowLeft');

      expect(activeDateChangeSpy).toHaveBeenCalledOnceWith({
        date: baseDate.addUTCDays(-1),
        autoFocus: true,
      });
    });

    it('should emit the next day on ArrowRight', () => {
      dispatchArrow('ArrowRight');

      expect(activeDateChangeSpy).toHaveBeenCalledOnceWith({
        date: baseDate.addUTCDays(1),
        autoFocus: true,
      });
    });

    it('should emit the day a week earlier on ArrowUp', () => {
      dispatchArrow('ArrowUp');

      expect(activeDateChangeSpy).toHaveBeenCalledOnceWith({
        date: baseDate.addUTCDays(-7),
        autoFocus: true,
      });
    });

    it('should emit the day a week later on ArrowDown', () => {
      dispatchArrow('ArrowDown');

      expect(activeDateChangeSpy).toHaveBeenCalledOnceWith({
        date: baseDate.addUTCDays(7),
        autoFocus: true,
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

  describe('Keyboard navigation without an active date', () => {
    it('should not emit when there is no active date', () => {
      const activeDateChangeSpy = spyOn(component.activeDateChange, 'emit');

      dispatchArrow('ArrowRight');

      expect(activeDateChangeSpy).not.toHaveBeenCalled();
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

    it('should not focus when a change other than the active date occurs', async () => {
      fixture.componentRef.setInput('activeDate', {
        date: baseDate,
        autoFocus: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      focusSpy.calls.reset();

      component.ngOnChanges({});
      await fixture.whenStable();

      expect(focusSpy).not.toHaveBeenCalled();
    });
  });
});
