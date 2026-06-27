export class CalendarDate {
  private _date: Date;

  // All dates in UTC to avoid issues with timezone changes
  constructor(year: number, month: number, day: number) {
    this._date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  }

  static fromUTCToLocal(date: CalendarDate): Date {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  static fromLocalToUTC(date: Date): CalendarDate {
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  addUTCDays(days: number): CalendarDate {
    return new CalendarDate(
      this.getUTCFullYear(),
      this.getUTCMonth(),
      this.getUTCDate() + days
    );
  }

  addUTCMonths(months: number): CalendarDate {
    const year = this.getUTCFullYear();
    const month = this.getUTCMonth() + months;
    const day = Math.min(
      this.getUTCDate(),
      CalendarDate.daysInMonth(year, month)
    );
    return new CalendarDate(year, month, day);
  }

  addUTCYears(years: number): CalendarDate {
    const year = this.getUTCFullYear() + years;
    const month = this.getUTCMonth();
    const day = Math.min(
      this.getUTCDate(),
      CalendarDate.daysInMonth(year, month)
    );
    return new CalendarDate(year, month, day);
  }

  // Getters
  getUTCDay(): number {
    return this._date.getUTCDay();
  }

  getUTCFullYear() {
    return this._date.getUTCFullYear();
  }

  getUTCWeek() {
    return this._date.getDay;
  }

  getUTCMonth() {
    return this._date.getUTCMonth();
  }

  getUTCDate() {
    return this._date.getUTCDate();
  }

  getTime() {
    return this._date.getTime();
  }

  getFirstDayOfMonth(): CalendarDate {
    return new CalendarDate(this.getUTCFullYear(), this.getUTCMonth(), 1);
  }

  getFirstDayOfWeek(initialWeekDay: number): CalendarDate {
    const offset = (this.getUTCDay() - initialWeekDay + 7) % 7;
    return this.addUTCDays(-offset);
  }

  getLastDayOfMonth(): CalendarDate {
    return new CalendarDate(this.getUTCFullYear(), this.getUTCMonth() + 1, 0);
  }

  getLastDayOfWeek(initialWeekDay: number): CalendarDate {
    const day = this.getUTCDay();
    const lastDayOfWeek = (initialWeekDay + 6) % 7;
    const offset = (lastDayOfWeek - day + 7) % 7;

    return this.addUTCDays(offset);
  }

  // Comparers
  isBefore(date: CalendarDate) {
    return this._date.getTime() < date.getTime();
  }

  isSameOrBefore(date: CalendarDate) {
    return this._date.getTime() <= date.getTime();
  }

  isAfter(date: CalendarDate) {
    return this._date.getTime() > date.getTime();
  }

  isSameOrAfter(date: CalendarDate) {
    return this._date.getTime() >= date.getTime();
  }

  isSame(date: CalendarDate) {
    return this._date.getTime() == date.getTime();
  }

  isInMonthsRange(dates: CalendarDate[]) {
    return dates.find(
      (date) =>
        this.isSameOrAfter(date.getFirstDayOfMonth()) &&
        this.isSameOrBefore(date.getLastDayOfMonth())
    );
  }

  // Formatters
  toISOString() {
    return this._date.toISOString();
  }

  private static daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  }
}
