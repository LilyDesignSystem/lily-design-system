// avatar-group.test.js
// AvatarGroup component test

const path = require("path");

describe("AvatarGroup", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "avatar-group.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.avatar-group");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("avatar-group");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.avatar-group");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
