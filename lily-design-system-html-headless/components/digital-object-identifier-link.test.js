// digital-object-identifier-link.test.js
// DigitalObjectIdentifierLink component test

const path = require("path");

describe("DigitalObjectIdentifierLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "digital-object-identifier-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.digital-object-identifier-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("digital-object-identifier-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.digital-object-identifier-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
