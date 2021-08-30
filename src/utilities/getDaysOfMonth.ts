export default function getDaysOfMonth(date: Date) {
  const monthArr = [];
  monthArr.push(new Array(7).fill(""));
  const currentDay = new Date(date.getFullYear(), date.getMonth());
  let counterWeekArray =
    currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1;
  let counterWeeksArray = 0;
  while (currentDay.getMonth() === date.getMonth()) {
    monthArr[counterWeeksArray][counterWeekArray] = currentDay.getDate();
    currentDay.setDate(currentDay.getDate() + 1);
    // if next day is a monday and not next month
    if (
      currentDay.getDay() === 1 &&
      currentDay.getMonth() === date.getMonth()
    ) {
      counterWeekArray = 0;
      counterWeeksArray++;
      monthArr.push(new Array(7).fill(""));
    } else {
      counterWeekArray++;
    }
  }
  return monthArr;
}
