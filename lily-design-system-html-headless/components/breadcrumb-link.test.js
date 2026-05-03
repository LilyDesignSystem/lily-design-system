// breadcrumb-link.test.js
// BreadcrumbLink component test

const path = require("path");

describe("BreadcrumbLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "breadcrumb-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.breadcrumb-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("breadcrumb-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.breadcrumb-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
