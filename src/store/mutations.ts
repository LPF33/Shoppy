import { MutationTree } from "vuex";
import {
  MutationTypes,
  IStoreState,
  IMealList,
  IDrogerieItem,
  ISupermarktItem,
  ISport,
} from "@/Types/Store";
import { authFirebase, shoppyFirestore } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import router from "@/router";

export type Mutations<S = IStoreState> = {
  [MutationTypes.SET_LOGIN](state: S): void;
  [MutationTypes.LOGOUT](state: S): void;
  [MutationTypes.SET_ERROR](state: S, msg: string): void;
  [MutationTypes.UNSUBSCRIBE_FIREBASE](state: S): void;
  [MutationTypes.SET_MEALS_FIREBASE](state: S): void;
  [MutationTypes.SET_SHOPPY_FIREBASE](state: S): void;
  [MutationTypes.SET_GENERAL_FIREBASE](state: S): void;
};

const mutations: MutationTree<IStoreState> & Mutations = {
  async [MutationTypes.SET_LOGIN](state) {
    state.isAuthenticated = true;
    state.error = false;
    router.push("/");
  },
  async [MutationTypes.LOGOUT](state) {
    state.isAuthenticated = false;
    state.user = null;
    state.mealList = null;
    state.supermarktItems = null;
    state.drogerieItems = null;
    state.shoppyIndex = null;
    state.sport = null;
    try {
      await signOut(authFirebase);
    } catch (err) {
      state.error = true;
    }
    router.push("/login");
  },
  [MutationTypes.SET_ERROR](state, msg) {
    state.error = true;
    state.errorMessage = msg;
  },
  [MutationTypes.UNSUBSCRIBE_FIREBASE](state) {
    if (typeof state.unsubscribeCooky === "function") {
      state.unsubscribeCooky();
    }
    if (typeof state.unsubscribeShoppy === "function") {
      state.unsubscribeShoppy();
    }
    if (typeof state.unsubscribeGeneral === "function") {
      state.unsubscribeGeneral();
    }
  },
  [MutationTypes.SET_MEALS_FIREBASE](state) {
    try {
      state.unsubscribeCooky = onSnapshot(
        collection(shoppyFirestore, "cooky"),
        (doc) => {
          state.mealList = doc.docs.map((item) => item.data()) as IMealList[];
        },
        (err) => {
          state.error = true;
          state.errorMessage = err.message;
        }
      );
    } catch (err) {
      state.error = true;
    }
  },
  [MutationTypes.SET_SHOPPY_FIREBASE](state) {
    try {
      state.unsubscribeShoppy = onSnapshot(
        collection(shoppyFirestore, "shoppy"),
        (doc) => {
          const newDoc = doc.docs
            .map((item) => item.data())
            .sort((a, b) => a.list_id - b.list_id);
          state.supermarktItems = newDoc.filter(
            (item) => item.category === "Supermarkt"
          ) as ISupermarktItem[];
          state.drogerieItems = newDoc.filter(
            (item) => item.category === "Drogerie"
          ) as IDrogerieItem[];
          state.shoppyIndex = newDoc[newDoc.length - 1].list_id + 1;
        },
        (err) => {
          state.error = true;
          state.errorMessage = err.message;
        }
      );
    } catch (err) {
      state.error = true;
    }
  },
  [MutationTypes.SET_GENERAL_FIREBASE](state) {
    try {
      state.unsubscribeGeneral = onSnapshot(
        collection(shoppyFirestore, "general"),
        (doc) => {
          state.sport = doc.docs
            .filter((item) => item.id === "sport")
            .map((item) => item.data())[0] as ISport;
        },
        (err) => {
          state.error = true;
          state.errorMessage = err.message;
        }
      );
    } catch (err) {
      state.error = true;
    }
  },
};

export default mutations;
