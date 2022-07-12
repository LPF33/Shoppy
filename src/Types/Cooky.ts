// Types for Cooky View & Components

export interface IMeal {
  key?: string;
  meal?: string;
  startDate: string;
  endDate: string;
}

export interface IComputedMealList {
  key: string;
  meal: string;
  startDate: string;
  endDate: string;
  color?: string;
  startNum?: number;
  endNum?: number;
}

export interface INewMeal {
  startDate: Date;
  startNum: number;
}

export interface ICookyAddMealData {
  today: Date;
  startDate: null | string;
  endDate: null | string;
  meal: string;
  existingKey: false | string;
}

export interface ICookyCalendarData {
  weekday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  today: Date;
}
