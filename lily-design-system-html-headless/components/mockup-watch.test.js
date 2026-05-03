// mockup-watch.test.js
// MockupWatch component test

const path = require("path");

describe("MockupWatch", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-watch.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-watch");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-watch");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-watch");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
