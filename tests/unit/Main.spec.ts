import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/index";
import Main from "@/views/Main.vue";

let $store = {
  state: {
    user: "lars@gmail.com",
  },
  commit: jest.fn(),
};

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
    const mainWrapper = wrapper.find("section");
    expect(mainWrapper.exists()).toBeTruthy();
    expect(mainWrapper.find("img").exists()).toBeTruthy();
    expect(mainWrapper.find(".main-emoji").text()).toBe("🦋");
    expect(mainWrapper.findAll("h3")).toHaveLength(2);
  });

  it("Main component renders as expected when not Lars is logged in", async () => {
    $store.state.user = "not-lars@gmail.com";
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const mainWrapper = wrapper.find("section");
    expect(mainWrapper.exists()).toBeTruthy();
    expect(mainWrapper.find("img").exists()).toBeTruthy();
    expect(mainWrapper.find(".main-emoji").exists()).toBeTruthy();
    expect(mainWrapper.findAll("h3")).toHaveLength(2);
  });

  it("Main component renders as expected when not Lars is logged in", async () => {
    $store.state.user = "not-lars@gmail.com";
    router.push("/");
    await router.isReady();
    const wrapper = mountMain();
    const mainWrapper = wrapper.find("section");
    expect(mainWrapper.exists()).toBeTruthy();
    expect(mainWrapper.find("img").exists()).toBeTruthy();
    expect(mainWrapper.find(".main-emoji").exists()).toBeTruthy();
    expect(mainWrapper.findAll("h3")).toHaveLength(2);
  });

  /* it("Click on router-link with name Budget navigates to '/budget'", async () => {
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
  }); */
});
