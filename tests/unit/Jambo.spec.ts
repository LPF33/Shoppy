import { mount } from "@vue/test-utils";
import Jambo from "@/views/Jambo.vue";

describe("Testing the Jambo component", () => {
  it("Initial Jambo component is mounted correctly", () => {
    const wrapper = mount(Jambo);
    expect(wrapper.html()).toMatchSnapshot();

    const jamboSection = wrapper.find("section");
    expect(jamboSection.exists()).toBeTruthy();
    expect(jamboSection.find("h1").text()).toBe("Jambo");
    expect(jamboSection.find("h2").text()).toBe("Start");
    expect(jamboSection.findAll("button")).toHaveLength(2);
    expect(jamboSection.findAll("button")[0].html()).toContain(
      '<font-awesome-icon icon="fa-duotone fa-joystick"></font-awesome-icon>'
    );
    expect(jamboSection.findAll("button")[1].html()).toContain(
      '<font-awesome-icon icon="fa-duotone fa-ban"></font-awesome-icon>'
    );
  });

  it("Click on first button, should increment counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll("section > button")[0];
    await incrementButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Spielzug: 1");
    expect(wrapper.findAll(".runde")).toHaveLength(1);
    expect(wrapper.find(".runde").html()).toContain(
      '<font-awesome-icon icon="fa-duotone fa-card-heart"></font-awesome-icon>'
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 3 times , should increment counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll("section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Spielzug: 3");
    expect(wrapper.findAll(".runde")).toHaveLength(3);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 6 times, should reset counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll("section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Spielzug: 5");
    expect(wrapper.findAll(".runde")).toHaveLength(5);
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Start");
    expect(wrapper.findAll(".runde")).toHaveLength(0);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 4 times, click on reset button, should reset counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll("section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Spielzug: 4");
    expect(wrapper.findAll(".runde")).toHaveLength(4);

    const resetButton = wrapper.findAll("section > button")[1];
    await resetButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Start");
    expect(wrapper.findAll(".runde")).toHaveLength(0);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
