// mockup-laptop.test.js
// MockupLaptop component test

const path = require("path");

describe("MockupLaptop", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-laptop.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-laptop");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-laptop");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-laptop");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
