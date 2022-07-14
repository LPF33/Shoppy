import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/index";
import Navbar from "@/components/Navbar.vue";

let $store = {
  state: {
    error: false,
    isAuthenticated: false,
  },
};

beforeEach(() => {
  $store = {
    state: {
      error: false,
      isAuthenticated: false,
    },
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const mountNavbar = () => {
  return mount(Navbar, {
    global: {
      plugins: [router],
      mocks: { $store },
    },
  });
};

describe("Testing the Navbar component", () => {
  it("When user is not logged in, Navbar should not exist", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountNavbar();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeFalsy();
  });

  it("When user is logged in, Navbar should render five router-links", async () => {
    $store.state.isAuthenticated = true;
    router.push("/");
    await router.isReady();
    const wrapper = mountNavbar();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(5);
    expect(wrapper.findAll("a")[0].attributes("href")).toBe("/");
    expect(wrapper.findAll("a")[0].find("p").text()).toBe("Home");
    expect(wrapper.findAll("a")[1].attributes("href")).toBe("/shoppy");
    expect(wrapper.findAll("a")[1].find("p").text()).toBe("Shoppy");
    expect(wrapper.findAll("a")[2].attributes("href")).toBe("/cooky");
    expect(wrapper.findAll("a")[2].find("p").text()).toBe("Cooky");
    expect(wrapper.findAll("a")[3].attributes("href")).toBe("/jambo");
    expect(wrapper.findAll("a")[3].find("p").text()).toBe("Jambo");
    expect(wrapper.findAll("a")[4].attributes("href")).toBe("/logout");
    expect(wrapper.findAll("a")[4].find("p").text()).toBe("Logout");
    expect(wrapper.findAll(".router-link-active")).toHaveLength(1);
    expect(wrapper.find(".router-link-active").attributes("href")).toBe("/");
  });

  it("User is logged in, navigate to Shoppy-Route, Navbar should render accordingly", async () => {
    $store.state.isAuthenticated = true;
    router.push("/shoppy");
    await router.isReady();
    const wrapper = mountNavbar();

    await flushPromises();
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(5);
    expect(wrapper.findAll(".router-link-active")).toHaveLength(1);
    expect(wrapper.find(".router-link-active").attributes("href")).toBe(
      "/shoppy"
    );
  });

  it("User is logged in, navigate to Cooky-Route, Navbar should render accordingly", async () => {
    $store.state.isAuthenticated = true;
    router.push("/cooky");
    await router.isReady();
    const wrapper = mountNavbar();

    await flushPromises();
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(5);
    expect(wrapper.findAll(".router-link-active")).toHaveLength(1);
    expect(wrapper.find(".router-link-active").attributes("href")).toBe(
      "/cooky"
    );
  });

  it("When error occurs, div with CSS class error-nav gets rendered", async () => {
    $store.state.error = true;
    await router.isReady();
    const wrapper = mountNavbar();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find(".error-nav").exists()).toBeTruthy();
    expect(wrapper.find(".error-nav").text()).toBe("❗");
  });

  it("Click on router-link with name Shoppy navigates to '/shoppy'", async () => {
    $store.state.isAuthenticated = true;
    await router.isReady();
    const wrapper = mountNavbar();

    const shoppyLink = wrapper.findAll("a")[1];
    expect(shoppyLink.attributes("href")).toBe("/shoppy");
    shoppyLink.trigger("click");
    await flushPromises();
    expect(wrapper.vm.$route.path).toBe("/shoppy");
  });

  it("Click on router-link with name Cooky navigates to '/cooky'", async () => {
    $store.state.isAuthenticated = true;
    await router.isReady();
    const wrapper = mountNavbar();

    const cookyLink = wrapper.findAll("a")[2];
    expect(cookyLink.attributes("href")).toBe("/cooky");
    cookyLink.trigger("click");
    await flushPromises();
    expect(wrapper.vm.$route.path).toBe("/cooky");
  });
});
