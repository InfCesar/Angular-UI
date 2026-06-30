import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  InputSignal,
  ModelSignal,
} from '@angular/core';
import { CalendarDate } from '../../calendar-date';
import { CellStateField } from '../../../types/day.type';
import { ActiveDate } from '../../../types/active-date.type';
import { WeekDay } from '@angular/common';

type CursorKeyAction = (date: CalendarDate, shiftKey: boolean) => CalendarDate;

@Directive()
export abstract class AlcActiveDateDirective {
  abstract activeDate: ModelSignal<ActiveDate>;
  abstract firstDayOfWeek: InputSignal<WeekDay>;

  private elementRef = inject(ElementRef);
  private injector = inject(Injector);

  constructor() {
    effect(() => {
      if (this.activeDate().autoFocus) {
        this.focusActiveOption();
      }
    });
  }

  // Keyboard navigation per the WAI ARIA spec
  // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/
  private readonly keyboardActions: Record<string, CursorKeyAction> = {
    ArrowLeft: (date) => date.addUTCDays(-1),
    ArrowRight: (date) => date.addUTCDays(+1),
    ArrowUp: (date) => date.addUTCDays(-7),
    ArrowDown: (date) => date.addUTCDays(+7),
    Home: (date) => date.getFirstDayOfWeek(this.firstDayOfWeek()),
    End: (date) => date.getLastDayOfWeek(this.firstDayOfWeek()),
    PageUp: (date, shiftKey) =>
      shiftKey ? date.addUTCYears(-1) : date.addUTCMonths(-1),
    PageDown: (date, shiftKey) =>
      shiftKey ? date.addUTCYears(1) : date.addUTCMonths(1),
  };

  @HostListener('keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent) {
    const action = this.keyboardActions[event.key];
    if (!action) return;

    event.preventDefault();
    const currentDate = this.activeDate().date;
    this.activeDate.set({
      date: action(currentDate, event.shiftKey),
      autoFocus: true,
    });
  }

  private focusActiveOption() {
    afterNextRender(
      () => {
        const activeOption = this.elementRef.nativeElement.querySelector(
          `.${CellStateField.active}`
        ) as HTMLElement | null;
        activeOption?.focus();
      },
      { injector: this.injector }
    );
  }
}
