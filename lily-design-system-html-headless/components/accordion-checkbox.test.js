// accordion-checkbox.test.js
// AccordionCheckbox component test

const path = require("path");

describe("AccordionCheckbox", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "accordion-checkbox.html")
    );
  });

  it("renders the root div with class accordion-checkbox", async function () {
    const el = await $("div.accordion-checkbox");
    await expect(el).toExist();
  });

  it("renders an input.accordion-checkbox-input inside the root", async function () {
    const input = await $(".accordion-checkbox > input.accordion-checkbox-input");
    await expect(input).toExist();
    expect(await input.getAttribute("type")).toBe("checkbox");
  });

  it("renders a label.accordion-checkbox-label inside the root", async function () {
    const label = await $(".accordion-checkbox > label.accordion-checkbox-label");
    await expect(label).toExist();
  });

  it("renders a panel.accordion-checkbox-panel inside the root", async function () {
    const panel = await $(".accordion-checkbox > div.accordion-checkbox-panel");
    await expect(panel).toExist();
  });

  it("links the checkbox aria-controls to the panel id", async function () {
    const input = await $(".accordion-checkbox-input");
    const panel = await $(".accordion-checkbox-panel");
    const ariaControls = await input.getAttribute("aria-controls");
    const panelId = await panel.getAttribute("id");
    expect(ariaControls).toBe(panelId);
  });

  it("links the panel aria-labelledby to the checkbox id", async function () {
    const input = await $(".accordion-checkbox-input");
    const panel = await $(".accordion-checkbox-panel");
    const checkboxId = await input.getAttribute("id");
    const ariaLabelledby = await panel.getAttribute("aria-labelledby");
    expect(ariaLabelledby).toBe(checkboxId);
  });

  it("sets the panel role to region", async function () {
    const panel = await $(".accordion-checkbox-panel");
    expect(await panel.getAttribute("role")).toBe("region");
  });

  it("hides the panel when unchecked", async function () {
    const input = await $(".accordion-checkbox-input");
    const panel = await $(".accordion-checkbox-panel");
    expect(await input.isSelected()).toBe(false);
    expect(await panel.getAttribute("hidden")).not.toBeNull();
    expect(await input.getAttribute("aria-expanded")).toBe("false");
  });

  it("reveals the panel when the checkbox is toggled", async function () {
    const input = await $(".accordion-checkbox-input");
    const panel = await $(".accordion-checkbox-panel");
    await input.click();
    expect(await input.isSelected()).toBe(true);
    expect(await panel.getAttribute("hidden")).toBeNull();
    expect(await input.getAttribute("aria-expanded")).toBe("true");
  });

  it("hides the panel again on a second toggle", async function () {
    const input = await $(".accordion-checkbox-input");
    const panel = await $(".accordion-checkbox-panel");
    await input.click();
    await input.click();
    expect(await input.isSelected()).toBe(false);
    expect(await panel.getAttribute("hidden")).not.toBeNull();
    expect(await input.getAttribute("aria-expanded")).toBe("false");
  });
});
