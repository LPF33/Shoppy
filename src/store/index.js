import { createStore } from "vuex";
import { authFirebase } from "@/firebase/config.js";
import { shoppyFirestore } from "@/firebase/config";
import firebase from "firebase/app";
import router from "@/router";

export default createStore({
  state() {
    return {
      isAuthenticated: false,
      error: false,
      errorMessage: "",
      user: null,
      mealList: null,
      unsubscribe: null,
    };
  },
  mutations: {
    async setLogin(state) {
      state.isAuthenticated = true;
      router.push("/");
    },
    async logout(state) {
      state.isAuthenticated = false;
      try {
        await authFirebase.signOut();
      } catch (err) {
        state.error = true;
      }
      router.push("/login");
    },
    setError(state, msg) {
      state.error = true;
      state.errorMessage = msg;
    },
  },
  actions: {
    async signIn({ commit }, { email, password }) {
      try {
        await authFirebase.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        await authFirebase.signInWithEmailAndPassword(email, password);
        commit("setLogin");
      } catch (err) {
        commit("setError", "Authentication failed");
      }
    },
    checkAuth({ commit, state }) {
      authFirebase.onAuthStateChanged((user) => {
        if (user) {
          state.user = user.email;
          commit("setLogin");
        }
      });
    },
    getMealsFirebase({ commit, state }) {
      state.unsubscribe = shoppyFirestore.collection("cooky").onSnapshot(
        (doc) => {
          console.log("m");
          state.mealList = doc.docs.map((item) => item.data());
        },
        () => commit("setError", "Firebase error")
      );
    },
    unsubscribeCookyFirebase({ state }) {
      if (typeof state.unsubscribe == "function") {
        state.unsubscribe();
      }
    },
  },
  modules: {},
});
