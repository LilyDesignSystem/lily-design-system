// mockup-window.test.js
// MockupWindow component test

const path = require("path");

describe("MockupWindow", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-window.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-window");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-window");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-window");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
