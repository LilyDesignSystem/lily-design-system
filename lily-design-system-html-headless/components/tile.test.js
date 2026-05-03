// tile.test.js
// Tile component test

const path = require("path");

describe("Tile", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "tile.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.tile");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("tile");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.tile");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
