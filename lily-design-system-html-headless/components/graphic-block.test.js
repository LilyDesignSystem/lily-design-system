// graphic-block.test.js
// GraphicBlock component test

const path = require("path");

describe("GraphicBlock", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "graphic-block.html"),
    );
  });

  it("should render the figure element with correct class", async function () {
    const el = await $("figure.graphic-block");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("graphic-block");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("figure.graphic-block");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='img'", async function () {
    const el = await $("figure.graphic-block");
    const r = await el.getAttribute("role");
    expect(r).toBe("img");
  });
});
