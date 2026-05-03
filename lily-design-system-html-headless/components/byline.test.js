// byline.test.js
// Byline component test

const path = require("path");

describe("Byline", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "byline.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.byline");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("byline");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.byline");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
