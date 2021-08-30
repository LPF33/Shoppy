export function getDateOfMonth(date: string): number {
  const dateOfMonth = new Date(date);
  return dateOfMonth.getDate();
}

export function checkMonth(date: string, today: Date) {
  const newDate = new Date(date);
  return newDate.getMonth() === today.getMonth();
}

export function checkDay(day: number, today: Date) {
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

export function dateFormat(year: number, month: number, day: number) {
  return `${year}-${padTime(++month)}-${padTime(day)}`;
}

export function padTime(val: number, len: number = 2) {
  return val.toString().padStart(len, "0");
}
