// chat-nav.test.js
// ChatNav component test

const path = require("path");

describe("ChatNav", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "chat-nav.html"),
    );
  });

  it("should render the nav element with correct class", async function () {
    const el = await $("nav.chat-nav");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("chat-nav");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("nav.chat-nav");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
