import { Directive, ElementRef, HostListener, inject, input, model } from "@angular/core";
import { CalendarDate } from "./calendar-date";
import { CellStateField } from "../types/day.type";

type CursorKeyAction = (currentActiveOption: CalendarDate) => CalendarDate;
type CursorKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';
type CursorKeysActions = {
  [key in CursorKey]: CursorKeyAction;
};

@Directive({
  standalone: true,
  selector: '[uiActiveDate]'
}) export class ActiveDateDirective {
  keyboardActions = input<CursorKeysActions>({
    ArrowLeft: (date: CalendarDate) => date.addUTCDays(-1),
    ArrowRight: (date: CalendarDate) => date.addUTCDays(+1),
    ArrowUp: (date: CalendarDate) => date.addUTCDays(-7),
    ArrowDown: (date: CalendarDate) => date.addUTCDays(+7),
  })
  activeDate = model<CalendarDate>();
  private elementRef = inject(ElementRef);

  @HostListener('keydown.arrowDown', ['$event'])
  @HostListener('keydown.arrowUp', ['$event'])
  @HostListener('keydown.arrowLeft', ['$event'])
  @HostListener('keydown.arrowRight', ['$event'])
  protected onKeyDown(event: Event) {
    const arrowCode = <keyof CursorKeysActions>(event as KeyboardEvent).key;
    const activeOption = this.activeDate();

    if (activeOption) {
      const newActive = this.keyboardActions()[arrowCode]?.(activeOption);
      this.activeDate.set(newActive);
      this.focusActiveOption();
    }
  }

  focusActiveOption() {
    setTimeout(()=>{
      const activeOption = <HTMLElement | null>this.elementRef.nativeElement.querySelector(`.${CellStateField.active}`);
      activeOption?.focus();
    });
  }
}