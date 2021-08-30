import { mount } from "@vue/test-utils";
import Jambo from "@/views/Jambo";

describe("Testing the Jambo component", () => {
  it("Initial Jambo component is mounted correctly", () => {
    const wrapper = mount(Jambo);
    expect(wrapper.html()).toMatchSnapshot();

    const jamboSection = wrapper.find(".jambo-section");
    expect(jamboSection.exists()).toBeTruthy();
    expect(jamboSection.find("h1").text()).toBe("Jambo");
    expect(jamboSection.find("h2").text()).toBe("Start");
    expect(jamboSection.findAll("button")).toHaveLength(2);
    expect(jamboSection.findAll("button")[0].text()).toBe("➕");
    expect(jamboSection.findAll("button")[1].text()).toBe("⚪");
  });

  it("Click on first button, should increment counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll(".jambo-section > button")[0];
    await incrementButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Spielzug: 1");
    expect(wrapper.findAll("section")).toHaveLength(1);
    expect(wrapper.findAll("section > .runde")).toHaveLength(1);
    expect(wrapper.find("section > .runde").text()).toBe("🎲");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 3 times , should increment counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll(".jambo-section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Spielzug: 3");
    expect(wrapper.findAll("section > .runde")).toHaveLength(3);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 6 times, should reset counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll(".jambo-section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Spielzug: 5");
    expect(wrapper.findAll("section > .runde")).toHaveLength(5);
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Start");
    expect(wrapper.find("section").exists()).toBeFalsy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Click on first button 4 times, click on reset button, should reset counter", async () => {
    const wrapper = mount(Jambo);

    const incrementButton = wrapper.findAll(".jambo-section > button")[0];
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");
    await incrementButton.trigger("click");

    expect(wrapper.find("h2").text()).toBe("Spielzug: 4");
    expect(wrapper.findAll("section > .runde")).toHaveLength(4);

    const resetButton = wrapper.findAll(".jambo-section > button")[1];
    await resetButton.trigger("click");
    expect(wrapper.find("h2").text()).toBe("Start");
    expect(wrapper.find("section").exists()).toBeFalsy();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
