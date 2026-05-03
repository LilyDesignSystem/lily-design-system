// scroller.test.js
// Scroller component test

const path = require("path");

describe("Scroller", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "scroller.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.scroller");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("scroller");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.scroller");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
