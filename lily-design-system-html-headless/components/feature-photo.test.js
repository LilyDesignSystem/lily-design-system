// feature-photo.test.js
// FeaturePhoto component test

const path = require("path");

describe("FeaturePhoto", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "feature-photo.html"),
    );
  });

  it("should render the figure element with correct class", async function () {
    const el = await $("figure.feature-photo");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("feature-photo");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("figure.feature-photo");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
