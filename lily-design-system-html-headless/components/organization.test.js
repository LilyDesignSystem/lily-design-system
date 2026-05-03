// organization.test.js
// Organization component test

const path = require("path");

describe("Organization", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "organization.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.organization");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("organization");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.organization");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
