// mockup-tablet-landscape.test.js
// MockupTabletLandscape component test

const path = require("path");

describe("MockupTabletLandscape", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-tablet-landscape.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-tablet-landscape");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-tablet-landscape");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-tablet-landscape");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
