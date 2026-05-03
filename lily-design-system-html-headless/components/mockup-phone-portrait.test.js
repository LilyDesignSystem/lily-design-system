// mockup-phone-portrait.test.js
// MockupPhonePortrait component test

const path = require("path");

describe("MockupPhonePortrait", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-phone-portrait.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-phone-portrait");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-phone-portrait");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-phone-portrait");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
