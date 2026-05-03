// code.test.js
// Code component test

const path = require("path");

describe("Code", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "code.html"),
    );
  });

  it("should render the code element with correct class", async function () {
    const el = await $("code.code");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("code");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("code.code");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
