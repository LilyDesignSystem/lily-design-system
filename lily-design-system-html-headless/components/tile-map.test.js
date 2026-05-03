// tile-map.test.js
// TileMap component test

const path = require("path");

describe("TileMap", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "tile-map.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.tile-map");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("tile-map");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.tile-map");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='img'", async function () {
    const el = await $("div.tile-map");
    const r = await el.getAttribute("role");
    expect(r).toBe("img");
  });
});
