// diff.test.js
// Diff component test

const path = require("path");

describe("Diff", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "diff.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.diff");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("diff");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.diff");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='group'", async function () {
    const el = await $("div.diff");
    const r = await el.getAttribute("role");
    expect(r).toBe("group");
  });
});
