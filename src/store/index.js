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
      supermarktItems: null,
      drogerieItems: null,
      shoppyIndex: null,
      unsubscribeCooky: null,
      unsubscribeShoppy: null,
    };
  },
  getters: {
    shoppyState: (state) => {
      return {
        supermarktItems: state.supermarktItems,
        drogerieItems: state.drogerieItems,
        shoppyIndex: state.shoppyIndex,
      };
    },
  },
  mutations: {
    async setLogin(state) {
      state.isAuthenticated = true;
      state.error = false;
      router.push("/");
    },
    async logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.mealList = null;
      state.supermarktItems = null;
      state.drogerieItems = null;
      state.shoppyIndex = null;
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
    unsubscribeFirebase(state) {
      if (typeof state.unsubscribeCooky == "function") {
        state.unsubscribeCooky();
      }
      if (typeof state.unsubscribeShoppy == "function") {
        state.unsubscribeShoppy();
      }
    },
    setMealsFirebase(state) {
      try {
        state.unsubscribeCooky = shoppyFirestore
          .collection("cooky")
          .onSnapshot((doc) => {
            state.mealList = doc.docs.map((item) => item.data());
          });
      } catch (err) {
        state.error = true;
        state.errorMessage = err;
      }
    },
    setShoppyFirebase(state) {
      try {
        state.unsubscribeShoppy = shoppyFirestore
          .collection("shoppy")
          .onSnapshot(
            (doc) => {
              let newDoc = doc.docs
                .map((item) => item.data())
                .sort((a, b) => a.list_id - b.list_id);
              state.supermarktItems = newDoc.filter(
                (item) => item.category === "Supermarkt"
              );
              state.drogerieItems = newDoc.filter(
                (item) => item.category === "Drogerie"
              );
              state.shoppyIndex = newDoc[newDoc.length - 1].list_id + 1;
            },
            (err) => {
              state.error = true;
              state.errorMessage = err;
            }
          );
      } catch (err) {
        state.error = true;
        state.errorMessage = err;
      }
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
      try {
        authFirebase.onAuthStateChanged((user) => {
          if (user) {
            state.user = user.email;
            commit("setLogin");
            commit("setMealsFirebase");
            commit("setShoppyFirebase");
          }
        });
      } catch (err) {
        commit("setError", err);
      }
    },
  },
  modules: {},
});
