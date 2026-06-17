// theme-select-button.test.js
// ThemeSelectButton component test

const path = require("path");

describe("ThemeSelectButton", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "theme-select-button.html"),
    );
  });

  it("should render the button element with correct class", async function () {
    const el = await $("button.theme-select-button");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("theme-select-button");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("button.theme-select-button");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
