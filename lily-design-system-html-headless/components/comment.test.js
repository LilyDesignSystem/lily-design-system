// comment.test.js
// Comment component test

const path = require("path");

describe("Comment", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "comment.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.comment");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("comment");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.comment");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
