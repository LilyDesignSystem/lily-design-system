// scroller-video.test.js
// ScrollerVideo component test

const path = require("path");

describe("ScrollerVideo", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "scroller-video.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.scroller-video");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("scroller-video");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.scroller-video");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
