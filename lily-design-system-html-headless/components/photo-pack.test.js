// photo-pack.test.js
// PhotoPack component test

const path = require("path");

describe("PhotoPack", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "photo-pack.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.photo-pack");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("photo-pack");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.photo-pack");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='group'", async function () {
    const el = await $("div.photo-pack");
    const r = await el.getAttribute("role");
    expect(r).toBe("group");
  });
});
