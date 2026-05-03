// citation.test.js
// Citation component test

const path = require("path");

describe("Citation", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "citation.html"),
    );
  });

  it("should render the cite element with correct class", async function () {
    const el = await $("cite.citation");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("citation");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("cite.citation");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
