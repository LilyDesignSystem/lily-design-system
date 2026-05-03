// contents-link.test.js
// ContentsLink component test

const path = require("path");

describe("ContentsLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "contents-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.contents-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("contents-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.contents-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
