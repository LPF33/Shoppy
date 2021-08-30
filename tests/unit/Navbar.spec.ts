import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/index.js";
import Navbar from "@/components/Navbar";

let $store = {};

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
  it("When user is not logged in, Navbar should have on router-link", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountNavbar();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(1);
    expect(wrapper.findAll("a")[0].attributes("href")).toBe("/login");
    expect(wrapper.findAll("a")[0].text()).toBe("Login");
  });

  it("When user is logged in, Navbar should render three router-links", async () => {
    $store.state.isAuthenticated = true;
    router.push("/");
    await router.isReady();
    const wrapper = mountNavbar();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find("nav").exists()).toBeTruthy();
    expect(wrapper.findAll("a")).toHaveLength(3);
    expect(wrapper.findAll("a")[0].attributes("href")).toBe("/");
    expect(wrapper.findAll("a")[0].text()).toBe("Main");
    expect(wrapper.findAll("a")[1].attributes("href")).toBe("/shoppy");
    expect(wrapper.findAll("a")[1].text()).toBe("Shoppy");
    expect(wrapper.findAll("a")[2].attributes("href")).toBe("/cooky");
    expect(wrapper.findAll("a")[2].text()).toBe("Cooky");
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
    expect(wrapper.findAll("a")).toHaveLength(3);
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
    expect(wrapper.findAll("a")).toHaveLength(3);
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
