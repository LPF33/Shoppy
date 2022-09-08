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
  });
});
