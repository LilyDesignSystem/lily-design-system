// content-block.test.js
// ContentBlock component test

const path = require("path");

describe("ContentBlock", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "content-block.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.content-block");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("content-block");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.content-block");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
