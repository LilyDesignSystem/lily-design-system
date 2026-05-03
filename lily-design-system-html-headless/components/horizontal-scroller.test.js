// horizontal-scroller.test.js
// HorizontalScroller component test

const path = require("path");

describe("HorizontalScroller", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "horizontal-scroller.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.horizontal-scroller");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("horizontal-scroller");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.horizontal-scroller");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='region'", async function () {
    const el = await $("div.horizontal-scroller");
    const r = await el.getAttribute("role");
    expect(r).toBe("region");
  });
});
