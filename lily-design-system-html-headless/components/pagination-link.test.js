// pagination-link.test.js
// PaginationLink component test

const path = require("path");

describe("PaginationLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "pagination-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.pagination-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("pagination-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.pagination-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
