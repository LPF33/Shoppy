import { ActionTree, ActionContext } from "vuex";
import { IStoreState, MutationTypes, ActionTypes } from "@/Types/Store";
import { Mutations } from "@/store/mutations";
import {
  setPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  browserLocalPersistence,
} from "firebase/auth";
import { authFirebase } from "@/firebase/config";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<IStoreState, IStoreState>, "commit">;

export interface Actions {
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: { email: string; password: string }
  ): Promise<void>;
}

const actions: ActionTree<IStoreState, IStoreState> = {
  async [ActionTypes.SIGN_IN]({ commit }, { email, password }) {
    try {
      await setPersistence(authFirebase, browserLocalPersistence);
      await signInWithEmailAndPassword(authFirebase, email, password);
      commit(MutationTypes.SET_LOGIN);
    } catch (err) {
      commit(MutationTypes.SET_ERROR, "Authentication failed");
    }
  },
  [ActionTypes.CHECK_AUTH]({ commit, state }) {
    try {
      onAuthStateChanged(authFirebase, (user) => {
        if (user) {
          state.user = user.email;
          commit(MutationTypes.SET_LOGIN);
          commit(MutationTypes.SET_MEALS_FIREBASE);
          commit(MutationTypes.SET_SHOPPY_FIREBASE);
          commit(MutationTypes.SET_GENERAL_FIREBASE);
        }
      });
    } catch (err) {
      commit(MutationTypes.SET_ERROR, err.message);
    }
  },
};

export default actions;
