// mockup-shell.test.js
// MockupShell component test

const path = require("path");

describe("MockupShell", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "mockup-shell.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.mockup-shell");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("mockup-shell");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.mockup-shell");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
