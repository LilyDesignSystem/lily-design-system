// mockup-browser.test.js
// MockupBrowser component test

const path = require("path");

describe("MockupBrowser", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-browser.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-browser");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-browser");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-browser");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
