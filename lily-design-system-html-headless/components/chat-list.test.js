// chat-list.test.js
// ChatList component test

const path = require("path");

describe("ChatList", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "chat-list.html"),
    );
  });

  it("should render the ol element with correct class", async function () {
    const el = await $("ol.chat-list");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("chat-list");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("ol.chat-list");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
