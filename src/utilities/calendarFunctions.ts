export function getDateOfMonth(date: string): number {
  const dateOfMonth = new Date(date);
  return dateOfMonth.getDate();
}

export function checkMonth(date: string, today: Date): boolean {
  const newDate = new Date(date);
  return newDate.getMonth() === today.getMonth();
}

export function checkDay(day: number, today: Date): boolean {
  const currentDate = new Date();
  if (
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === day
  ) {
    return true;
  }
  return false;
}

export function checkDateIfToday(
  date: Date,
  compareToDate: Date = new Date()
): boolean {
  if (
    compareToDate.getFullYear() === date.getFullYear() &&
    compareToDate.getMonth() === date.getMonth() &&
    compareToDate.getDate() === date.getDate()
  ) {
    return true;
  }
  return false;
}

export function checkDateIfSameWeek(
  date: Date,
  compareToDate: Date = new Date()
): boolean {
  if (
    compareToDate.getFullYear() === date.getFullYear() &&
    compareToDate.getMonth() === date.getMonth()
  ) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dateDays = Math.floor(
      (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    const compareToDateDays = Math.floor(
      (compareToDate.getTime() - firstDayOfYear.getTime()) /
        (24 * 60 * 60 * 1000)
    );
    return Math.ceil(dateDays / 7) === Math.ceil(compareToDateDays / 7);
  }
  return false;
}

export function dateFormat(year: number, month: number, day: number): string {
  return `${year}-${padTime(++month)}-${padTime(day)}`;
}

export function padTime(val: number, len: number = 2): string {
  return val.toString().padStart(len, "0");
}
