import { IStoreState } from "@/Types/Store";

export default function state(): IStoreState {
  return {
    isAuthenticated: false,
    error: false,
    errorMessage: "",
    user: null,
    mealList: null,
    supermarktItems: null,
    drogerieItems: null,
    shoppyIndex: null,
    unsubscribeCooky: null,
    unsubscribeShoppy: null,
  };
}
