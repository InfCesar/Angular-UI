export class CalendarDate {
  private _date: Date;

  // All dates in UTC to avoid issues with timezone changes on months rebuilding
  constructor(year: number, month: number, day: number) {
    this._date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  }

  static parseDateAsLocalTime(date: Date): CalendarDate {
    return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static parseDateAsUTC(date: Date): CalendarDate {
    return new CalendarDate(date.getUTCDate(), date.getUTCMonth(), date.getUTCDate());
  }

  addDays(days: number): CalendarDate {
    this._date.setUTCDate(this.getDate() + days);
    return this;
  }

  clone(): CalendarDate {
    return new CalendarDate(this.getYear(), this.getMonth(), this.getDate());
  }

  setDate(date: number): CalendarDate {
    this._date.setUTCDate(date);
    return this;
  }

  // Getters
  getDayOfWeek(): number {
    return this._date.getUTCDay();
  }

  getYear() {
    return this._date.getUTCFullYear();
  }

  getMonth() {
    return this._date.getUTCMonth();
  }

  getDate() {
    return this._date.getUTCDate();
  }

  getTime() {
    return this._date.getTime();
  }

  getDaysInMonth(): number {
    return new CalendarDate(this.getYear(), this.getMonth()+1, 0).getDate();
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

  toISOString() {
    return this._date.toISOString();
  }
}