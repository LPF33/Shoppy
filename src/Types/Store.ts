// Main Types for VUEX Store

export interface IMealList {
  key: string;
  meal: string;
  startDate: string;
  endDate: string;
}

export interface ISupermarktItem {
  category: "Supermarkt";
  done: boolean;
  key: string;
  list_id: number;
  name: string;
  last: boolean;
}

export interface IDrogerieItem {
  category: "Drogerie";
  done: boolean;
  key: string;
  list_id: number;
  name: string;
  last: boolean;
}

export interface ISport {
  first: boolean;
  second: boolean;
  date: string;
}

export interface IStoreState {
  isAuthenticated: boolean;
  error: boolean;
  errorMessage: string;
  user: null | string;
  mealList: null | IMealList[];
  supermarktItems: null | ISupermarktItem[];
  drogerieItems: null | IDrogerieItem[];
  shoppyIndex: null | number;
  sport: null | ISport;
  info: string;
  unsubscribeCooky: null | (() => void);
  unsubscribeShoppy: null | (() => void);
  unsubscribeGeneral: null | (() => void);
}

export enum MutationTypes {
  SET_LOGIN = "setLogin",
  LOGOUT = "logout",
  SET_ERROR = "setError",
  UNSUBSCRIBE_FIREBASE = "unsubscribeFirebase",
  SET_MEALS_FIREBASE = "setMealsFirebase",
  SET_SHOPPY_FIREBASE = "setShoppyFirebase",
  SET_GENERAL_FIREBASE = "setGeneralFirebase",
}

export enum ActionTypes {
  SIGN_IN = "signInWithFirebase",
  CHECK_AUTH = "checkIfUserIsAuth",
}
