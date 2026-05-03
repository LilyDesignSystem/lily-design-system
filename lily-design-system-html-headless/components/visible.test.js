// visible.test.js
// Visible component test

const path = require("path");

describe("Visible", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "visible.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.visible");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("visible");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.visible");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
