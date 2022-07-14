import { DOMWrapper, mount } from "@vue/test-utils";
import { createStore } from "vuex";
import Login from "@/views/Login.vue";

const actions = {
  signInWithFirebase: jest.fn(),
};

let store = createStore({
  state() {
    return {
      error: false,
      errorMessage: "Error",
    };
  },
  actions,
});

beforeEach(() => {
  store = createStore({
    state() {
      return {
        error: false,
        errorMessage: "Error",
      };
    },
    actions,
  });
});

const mountLogin = () => {
  return mount(Login, {
    global: {
      plugins: [store],
    },
  });
};

describe("Testing the Login component", () => {
  it("Login contains a form with h1, 2x input fields, button", () => {
    const wrapper = mountLogin();
    expect(wrapper.html()).toMatchSnapshot();
    const form = wrapper.find("form");
    expect(form.exists()).toBeTruthy();
    expect(form.find("h1").exists()).toBeTruthy();
    expect(form.find("h1").text()).toBe("Login");
    const allInputs = form.findAll("input");
    expect(allInputs).toHaveLength(2);
    expect(allInputs[0].attributes("type")).toBe("email");
    expect(allInputs[1].attributes("type")).toBe("password");
    expect(form.find("button").text()).toBe("Submit");
    expect(form.find("button").attributes("type")).toBe("submit");
  });

  it("Fill in email & password, fire Submit event on form, the data is passed to the dispatch function", async () => {
    const wrapper = mountLogin();
    const form = wrapper.find("form");
    const emailInput = wrapper.find(
      "input[type='email']"
    ) as DOMWrapper<HTMLInputElement>;
    await emailInput.setValue("test@gmail.com");
    expect(emailInput.element.value).toBe("test@gmail.com");
    const passwordInput = wrapper.find(
      "input[type='password']"
    ) as DOMWrapper<HTMLInputElement>;
    await passwordInput.setValue("123456");
    expect(passwordInput.element.value).toBe("123456");

    const button = form.find("button");
    await button.trigger("submit");
    expect(actions.signInWithFirebase).toHaveBeenCalledTimes(1);
    expect(actions.signInWithFirebase.mock.calls[0][1]).toEqual({
      email: "test@gmail.com",
      password: "123456",
    });
  });

  it("Error occurs, should show a div-tag with CSS class 'error' and error Message", () => {
    store = createStore({
      state() {
        return {
          error: true,
          errorMessage: "Error",
        };
      },
      actions,
    });
    const wrapper = mountLogin();
    expect(wrapper.html()).toMatchSnapshot();
    const errorDiv = wrapper.find(".error");
    expect(errorDiv.exists()).toBeTruthy();
    expect(errorDiv.text()).toBe("Error");
  });

  it("If there is no error, no div-tag with CSS class 'error' rendered on screen", () => {
    const wrapper = mountLogin();
    const errorDiv = wrapper.find(".error");
    expect(errorDiv.exists()).toBeFalsy();
  });
});
