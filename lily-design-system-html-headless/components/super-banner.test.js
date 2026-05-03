// super-banner.test.js
// SuperBanner component test

const path = require("path");

describe("SuperBanner", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "super-banner.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.super-banner");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("super-banner");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.super-banner");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='alert'", async function () {
    const el = await $("div.super-banner");
    const r = await el.getAttribute("role");
    expect(r).toBe("alert");
  });
});
