// theme-provider.test.js
// ThemeProvider component test

const path = require("path");

describe("ThemeProvider", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "theme-provider.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.theme-provider");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("theme-provider");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.theme-provider");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
