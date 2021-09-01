// Types for Budget.vue

type firebaseUnsubscribe = null | (() => void);

export type TCategory =
  | "Supermarkt"
  | "Drogerie"
  | "Versicherung"
  | "Rundfunk"
  | "Bofrost"
  | "Urlaub"
  | "Amazon";

export type CategoryTuple = [
  "Supermarkt",
  "Drogerie",
  "Versicherung",
  "Rundfunk",
  "Bofrost",
  "Urlaub",
  "Amazon"
];

export enum EMonth {
  Januar,
  Februar,
  März,
  April,
  Mai,
  Juni,
  Juli,
  August,
  September,
  Oktober,
  November,
  Dezember,
}

export type TMonth = keyof typeof EMonth;

export interface IExpenses {
  amount: number;
  category: TCategory;
  closed: false;
  month: TMonth;
  monthNum: number;
  year: number;
  name: "Lars" | "Caroline";
  key: string;
}

export interface IMonthlyExpenses {
  Supermarkt: number;
  Drogerie: number;
  Versicherung: number;
  Rundfunk: number;
  Bofrost: number;
  Urlaub: number;
  Amazon: number;
  month: TMonth;
  year: number;
  closed: true;
}

export interface IBudgetData {
  showAddExpense: boolean;
  expenses: [] | (IExpenses | IMonthlyExpenses)[];
  unsubscribeExpenses: firebaseUnsubscribe;
}
