// draft.test.js
// Draft component test

const path = require("path");

describe("Draft", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "draft.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.draft");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("draft");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.draft");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should have a data-status attribute", async function () {
    const el = await $("div.draft");
    const status = await el.getAttribute("data-status");
    expect(status).not.toBeNull();
  });
});
