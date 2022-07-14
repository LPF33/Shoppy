import { mount, shallowMount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";
import { routes } from "@/router/index";
import App from "@/App.vue";
import Login from "@/views/Login.vue";
import Main from "@/views/Main.vue";
import Shoppy from "@/views/Shoppy.vue";
import Cooky from "@/views/Cooky.vue";
import Jambo from "@/views/Jambo.vue";
import Logout from "@/views/Logout.vue";
import Navbar from "@/components/Navbar.vue";

let actions = {
  checkIfUserIsAuth: jest.fn(),
};

function createSetup(authenticated = false) {
  actions = {
    checkIfUserIsAuth: jest.fn(),
  };

  const $store = createStore({
    state() {
      return {
        isAuthenticated: authenticated,
      };
    },
    actions,
  });

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if ($store.state.isAuthenticated) {
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
      if ($store.state.isAuthenticated) {
        next("/");
        return;
      }
      next();
    } else {
      next();
    }
  });

  return { router, $store };
}

describe("Testing the App component", () => {
  it("App is mounted correctly when user is not logged in", async () => {
    const { router, $store } = createSetup();
    router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
      },
    });

    expect(actions.checkIfUserIsAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(Navbar).exists()).toBeTruthy();
    expect(wrapper.vm.$route.path).toBe("/login");
    expect(wrapper.findComponent(Login).exists()).toBeTruthy();
    expect(wrapper.findComponent(Main).exists()).toBeFalsy();
  });

  it("App is mounted correctly when user is logged in", async () => {
    const { router, $store } = createSetup(true);
    router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
      },
    });

    expect(actions.checkIfUserIsAuth).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(Navbar).exists()).toBeTruthy();
    expect(wrapper.vm.$route.path).toBe("/");
    expect(wrapper.findComponent(Main).exists()).toBeTruthy();
    expect(wrapper.findComponent(Login).exists()).toBeFalsy();
  });

  it("When user not logged in, trying to go to '/' redirected to '/login'", async () => {
    const { router, $store } = createSetup(false);
    router.push("/");
    await router.isReady();

    const wrapper = shallowMount(App, {
      global: {
        plugins: [router, $store],
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.vm.$route.path).toBe("/login");
  });

  it("When user logged in, trying to go to '/login' redirected to '/'", async () => {
    const { router, $store } = createSetup(true);
    router.push("/login");
    await router.isReady();

    const wrapper = shallowMount(App, {
      global: {
        plugins: [router, $store],
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.vm.$route.path).toBe("/");
  });

  it("When user logged in, navigating to '/shoppy' will render Shoppy component", async () => {
    const { router, $store } = createSetup(true);
    router.push("/shoppy");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
        stubs: {
          Shoppy: true,
        },
      },
    });

    expect(wrapper.vm.$route.path).toBe("/shoppy");
    expect(wrapper.findComponent(Shoppy).exists()).toBeTruthy();
  });

  it("When user logged in, navigating to '/cooky' will render Cooky component", async () => {
    const { router, $store } = createSetup(true);
    router.push("/cooky");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
        stubs: {
          Cooky: true,
        },
      },
    });

    expect(wrapper.vm.$route.path).toBe("/cooky");
    expect(wrapper.findComponent(Cooky).exists()).toBeTruthy();
  });

  it("When user logged in, navigating to '/jambo' will render Jambo component", async () => {
    const { router, $store } = createSetup(true);
    router.push("/jambo");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
        stubs: {
          Jambo: true,
        },
      },
    });

    expect(wrapper.vm.$route.path).toBe("/jambo");
    expect(wrapper.findComponent(Jambo).exists()).toBeTruthy();
  });

  it("When user logged in, navigating to '/logout' will render Logout component", async () => {
    const { router, $store } = createSetup(true);
    router.push("/logout");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, $store],
        stubs: {
          Logout: true,
        },
      },
    });

    expect(wrapper.vm.$route.path).toBe("/logout");
    expect(wrapper.findComponent(Logout).exists()).toBeTruthy();
  });
});
