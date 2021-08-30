import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/index.js";
import Main from "@/views/Main";

let $store = {};

beforeEach(() => {
  $store = {
    state: {
      user: "lars@gmail.com",
    },
    commit: jest.fn(),
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const mountMain = () => {
  return mount(Main, {
    data() {
      return {
        publicPath: "http://localhost:3000/",
      };
    },
    global: {
      plugins: [router],
      mocks: { $store },
    },
  });
};

describe("Testing the Main component", () => {
  it("Main component renders as expected when Lars is logged in", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const mainWrapper = wrapper.find("main");
    expect(mainWrapper.exists()).toBeTruthy();
    expect(mainWrapper.find("img").attributes("src")).toContain(
      "img/wedding.JPG"
    );
    expect(mainWrapper.find(".header").exists()).toBeFalsy();
    expect(mainWrapper.find(".emoji").text()).toBe("🦋");
    expect(mainWrapper.find("aside").text()).toContain("Tage bis zur Hochzeit");
    const footer = mainWrapper.find("footer");
    expect(footer.exists()).toBeTruthy();
    expect(footer.findAll("a")).toHaveLength(2);
    expect(footer.findAll("button")).toHaveLength(1);
  });

  it("Click on Logout-Button, should call 2 $store commit functions", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const logoutButton = wrapper.find("button");
    await logoutButton.trigger("click");
    expect($store.commit).toHaveBeenCalledTimes(2);
    expect($store.commit.mock.calls[0][0]).toBe("unsubscribeFirebase");
    expect($store.commit.mock.calls[1][0]).toBe("logout");
  });

  it("Main component renders as expected when not Lars is logged in", async () => {
    $store.state.user = "not-lars@gmail.com";
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const mainWrapper = wrapper.find("main");
    expect(mainWrapper.exists()).toBeTruthy();
    expect(mainWrapper.find("img").attributes("src")).toContain(
      "img/wedding.JPG"
    );
    expect(mainWrapper.find(".header").exists()).toBeTruthy();
    expect(mainWrapper.find("aside").text()).toContain("Tage bis zur Hochzeit");
    const footer = mainWrapper.find("footer");
    expect(footer.exists()).toBeTruthy();
    expect(footer.findAll("a")).toHaveLength(2);
    expect(footer.findAll("button")).toHaveLength(1);
  });

  it("Click on router-link with name Budget navigates to '/budget'", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const jamboLink = wrapper.findAll("a")[0];
    expect(jamboLink.attributes("href")).toBe("/budget");
    jamboLink.trigger("click");
    await flushPromises();
    expect(wrapper.vm.$route.path).toBe("/budget");
  });

  it("Click on router-link with name Jambo navigates to '/jambo'", async () => {
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const jamboLink = wrapper.findAll("a")[1];
    expect(jamboLink.attributes("href")).toBe("/jambo");
    jamboLink.trigger("click");
    await flushPromises();
    expect(wrapper.vm.$route.path).toBe("/jambo");
  });
});
