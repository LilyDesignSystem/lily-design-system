// slider-button.test.js
// SliderButton component test

const path = require("path");

describe("SliderButton", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "slider-button.html"),
    );
  });

  it("should render the button element with correct class", async function () {
    const el = await $("button.slider-button");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("slider-button");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("button.slider-button");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='slider'", async function () {
    const el = await $("button.slider-button");
    const r = await el.getAttribute("role");
    expect(r).toBe("slider");
  });
});
