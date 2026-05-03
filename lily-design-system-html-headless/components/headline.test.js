// headline.test.js
// Headline component test

const path = require("path");

describe("Headline", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "headline.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.headline");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("headline");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.headline");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
