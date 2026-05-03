// loading.test.js
// Loading component test

const path = require("path");

describe("Loading", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "loading.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.loading");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("loading");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.loading");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='status'", async function () {
    const el = await $("div.loading");
    const r = await el.getAttribute("role");
    expect(r).toBe("status");
  });
});
