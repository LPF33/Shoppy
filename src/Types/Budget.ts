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

export interface IExpenses {
  amount: number;
  category: TCategory;
  closed: boolean;
  created_at: Date;
  name: "Lars" | "Caroline";
}

export interface IBudgetData {
  showAddExpense: boolean;
  expenses: [] | IExpenses[];
  unsubscribeExpenses: firebaseUnsubscribe;
}
