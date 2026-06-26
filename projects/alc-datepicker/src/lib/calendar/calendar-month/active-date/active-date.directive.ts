import {
  afterNextRender,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CalendarDate } from '../../calendar-date';
import { CellStateField } from '../../../types/day.type';
import { ActiveDate } from '../../../types/active-date.type';

type CursorKeyAction = (date: CalendarDate) => CalendarDate;

@Directive()
export class AlcActiveDateDirective implements OnChanges {
  @Input() activeDate?: ActiveDate;
  @Output() activeDateChange = new EventEmitter<ActiveDate>();

  private elementRef = inject(ElementRef);
  private injector = inject(Injector);

  private readonly keyboardActions: Record<string, CursorKeyAction> = {
    ArrowLeft: (date) => date.addUTCDays(-1),
    ArrowRight: (date) => date.addUTCDays(+1),
    ArrowUp: (date) => date.addUTCDays(-7),
    ArrowDown: (date) => date.addUTCDays(+7),
  };

  @HostListener('keydown.arrowLeft', ['$event'])
  @HostListener('keydown.arrowRight', ['$event'])
  @HostListener('keydown.arrowUp', ['$event'])
  @HostListener('keydown.arrowDown', ['$event'])
  protected onKeyDown(event: Event) {
    event.preventDefault();
    const current = this.activeDate?.date;
    if (!current) return;
    const action = this.keyboardActions[(event as KeyboardEvent).key];
    if (!action) return;
    this.activeDateChange.emit({ date: action(current), autoFocus: true });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeDate'] && this.activeDate?.autoFocus) {
      this.focusActiveOption();
    }
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
