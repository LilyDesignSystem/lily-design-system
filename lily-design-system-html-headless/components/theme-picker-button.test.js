// theme-picker-button.test.js
// ThemePickerButton component test

const path = require("path");

describe("ThemePickerButton", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "theme-picker-button.html"),
    );
  });

  it("should render the button element with correct class", async function () {
    const el = await $("button.theme-picker-button");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("theme-picker-button");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("button.theme-picker-button");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
