// tree-link.test.js
// TreeLink component test

const path = require("path");

describe("TreeLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "tree-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.tree-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("tree-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.tree-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
