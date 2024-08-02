import { Injectable, InjectionToken } from "@angular/core";
import { CalendarDate } from "./calendar-date";

export interface UiCalendarSelectionStrategy {
    onSelect(newSelection: CalendarDate, selectedDays?: CalendarDate[]): CalendarDate[];
}

@Injectable()
export class UiCalendarSingleSelectionStrategy implements UiCalendarSelectionStrategy {
    onSelect(newSelection: CalendarDate): CalendarDate[] {
        return [newSelection];
    }
}

export const UI_CALENDAR_SELECTION_STRATEGY = new InjectionToken<UiCalendarSelectionStrategy>('calendar.config', {
    providedIn: 'root',
    factory: ()=> new UiCalendarSingleSelectionStrategy()
})