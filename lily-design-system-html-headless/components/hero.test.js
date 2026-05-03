// hero.test.js
// Hero component test

const path = require("path");

describe("Hero", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "hero.html"),
    );
  });

  it("should render the section element with correct class", async function () {
    const el = await $("section.hero");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("hero");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("section.hero");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
