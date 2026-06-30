import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { Injector, NgZone, Type } from '@angular/core';

import {
  AlcCalendarComponent,
  AlcCalendarMonthComponent,
  CalendarDate,
} from './public-api';
import { AlcDateI18n } from './lib/locale/date-formatter';

/**
 * Maps a custom-element tag name to the Angular component it wraps. The tags
 * are deliberately namespaced (`alc-elements-*`) so they never collide with the
 * components' own Angular selectors (`alc-calendar`, `alc-calendar-month`)
 */
const elements: Array<{ tag: string; component: Type<unknown> }> = [
  { tag: 'alc-elements-calendar', component: AlcCalendarComponent },
  { tag: 'alc-elements-month', component: AlcCalendarMonthComponent },
];

/** Public API the host page can use to drive the elements from plain JS. */
interface AlcDatepickerApi {
  setLocale(locale: string): void;
  CalendarDate: typeof CalendarDate;
}

declare global {
  interface Window {
    alcDatepicker: AlcDatepickerApi;
  }
}

(async () => {
  const app = await createApplication();
  const injector: Injector = app.injector;

  for (const { tag, component } of elements) {
    if (!customElements.get(tag)) {
      customElements.define(tag, createCustomElement(component, { injector }));
    }
  }

  // Locale is handled here, OUTSIDE the components: we resolve the shared
  // formatter from the application injector and expose a setter on the host
  // page.
  const zone = injector.get(NgZone);
  const i18n = injector.get(AlcDateI18n);

  window.alcDatepicker = {
    setLocale: (locale) => zone.run(() => i18n.setLocale(locale)),
    CalendarDate,
  };
})();
