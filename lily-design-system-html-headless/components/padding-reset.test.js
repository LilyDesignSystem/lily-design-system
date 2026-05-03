// padding-reset.test.js
// PaddingReset component test

const path = require("path");

describe("PaddingReset", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "padding-reset.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.padding-reset");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("padding-reset");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.padding-reset");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
