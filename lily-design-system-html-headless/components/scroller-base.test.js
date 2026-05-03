// scroller-base.test.js
// ScrollerBase component test

const path = require("path");

describe("ScrollerBase", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "scroller-base.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.scroller-base");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("scroller-base");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.scroller-base");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
