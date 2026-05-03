// code-block.test.js
// CodeBlock component test

const path = require("path");

describe("CodeBlock", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "code-block.html"),
    );
  });

  it("should render the pre element with correct class", async function () {
    const el = await $("pre.code-block");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("code-block");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("pre.code-block");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
