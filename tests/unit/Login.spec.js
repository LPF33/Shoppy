import { mount } from "@vue/test-utils";
import Login from "@/views/Login";

let $store = {};

beforeEach(() => {
  $store = {
    state: {
      error: false,
      errorMessage: "",
    },
    dispatch: jest.fn(),
  };
});

describe("Testing the Login component", () => {
  it("Login contains a form with h1, 2x input fields, button", () => {
    const wrapper = mount(Login, {
      global: {
        mocks: { $store },
      },
    });
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
    const wrapper = mount(Login, {
      global: {
        mocks: { $store },
      },
    });
    const form = wrapper.find("form");
    const emailInput = wrapper.find("input[type='email']");
    await emailInput.setValue("test@gmail.com");
    expect(wrapper.find("input[type='email']").element.value).toBe(
      "test@gmail.com"
    );
    const passwordInput = wrapper.find("input[type='password']");
    await passwordInput.setValue("123456");
    expect(wrapper.find("input[type='password']").element.value).toBe("123456");

    const button = form.find("button");
    await button.trigger("submit");
    await wrapper.vm.$nextTick();
    expect($store.dispatch).toHaveBeenCalledTimes(1);
    expect($store.dispatch.mock.calls[0][0]).toBe("signIn");
    expect($store.dispatch.mock.calls[0][1]).toEqual({
      email: "test@gmail.com",
      password: "123456",
    });
  });

  it("Error occurs, should show a div-tag with CSS class 'error' and error Message", () => {
    $store = {
      state: {
        error: true,
        errorMessage: "Error",
      },
      dispatch: jest.fn(),
    };
    const wrapper = mount(Login, {
      global: {
        mocks: { $store },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    const errorDiv = wrapper.find(".error");
    expect(errorDiv.exists()).toBeTruthy();
    expect(errorDiv.text()).toBe("Error");
  });

  it("If there is no error, no div-tag with CSS class 'error' rendered on screen", () => {
    const wrapper = mount(Login, {
      global: {
        mocks: { $store },
      },
    });

    const errorDiv = wrapper.find(".error");
    expect(errorDiv.exists()).toBeFalsy();
  });
});
