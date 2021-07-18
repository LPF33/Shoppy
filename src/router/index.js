import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import Shoppy from "../views/Shoppy.vue";
import Jambo from "../views/Jambo.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: { requiresAuth: true },
  },
  {
    path: "/shoppy",
    name: "Shoppy",
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Shoppy,
  },
  {
    path: "/jambo",
    name: "Jambo",
    meta: { requiresAuth: true },
    component: Jambo,
  },
  {
    path: "/budget",
    name: "Budget",
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Budget.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: { guest: true },
    component: () => import("../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.state.isAuthenticated) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.state.isAuthenticated) {
      next("/");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
