import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import Shoppy from "../views/Shoppy.vue";
import Jambo from "../views/Jambo.vue";
import Cooky from "../views/Cooky.vue";
import store from "@/store/index";

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
    path: "/logout",
    name: "Logout",
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Logout.vue"),
  },
  {
    path: "/cooky",
    name: "Cooky",
    meta: { requiresAuth: true },
    component: Cooky,
  },
  {
    path: "/login",
    name: "Login",
    meta: { guest: true },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    meta: { requiresAuth: true },
    component: () => import("../views/Settings.vue"),
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
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (store.state.isAuthenticated) {
      next("/");
      return;
    }
    next();
  } else {
    next("/");
  }
});

export default router;
export { routes };
