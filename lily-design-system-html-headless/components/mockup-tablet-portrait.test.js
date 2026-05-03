// mockup-tablet-portrait.test.js
// MockupTabletPortrait component test

const path = require("path");

describe("MockupTabletPortrait", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-tablet-portrait.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-tablet-portrait");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-tablet-portrait");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-tablet-portrait");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
