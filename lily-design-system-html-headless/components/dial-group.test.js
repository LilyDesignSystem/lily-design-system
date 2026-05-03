// dial-group.test.js
// DialGroup component test

const path = require("path");

describe("DialGroup", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "dial-group.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.dial-group");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("dial-group");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.dial-group");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have role='group'", async function () {
    const el = await $("div.dial-group");
    const r = await el.getAttribute("role");
    expect(r).toBe("group");
  });
});
