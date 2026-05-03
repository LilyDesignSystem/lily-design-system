// place.test.js
// Place component test

const path = require("path");

describe("Place", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "place.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.place");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("place");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.place");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
