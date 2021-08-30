import { ActionTree, ActionContext } from "vuex";
import { IStoreState, MutationTypes, ActionTypes } from "@/Types/Store";
import { Mutations } from "@/store/mutations";
import firebase from "firebase/app";
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
      await authFirebase.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await authFirebase.signInWithEmailAndPassword(email, password);
      commit(MutationTypes.SET_LOGIN);
    } catch (err) {
      commit(MutationTypes.SET_ERROR, "Authentication failed");
    }
  },
  [ActionTypes.CHECK_AUTH]({ commit, state }) {
    try {
      authFirebase.onAuthStateChanged((user) => {
        if (user) {
          state.user = user.email;
          commit(MutationTypes.SET_LOGIN);
          commit(MutationTypes.SET_MEALS_FIREBASE);
          commit(MutationTypes.SET_SHOPPY_FIREBASE);
        }
      });
    } catch (err) {
      commit(MutationTypes.SET_ERROR, err.message);
    }
  },
};

export default actions;
