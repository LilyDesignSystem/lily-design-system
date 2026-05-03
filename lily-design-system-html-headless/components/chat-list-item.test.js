// chat-list-item.test.js
// ChatListItem component test

const path = require("path");

describe("ChatListItem", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "chat-list-item.html"),
    );
  });

  it("should render the li element with correct class", async function () {
    const el = await $("li.chat-list-item");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("chat-list-item");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("li.chat-list-item");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
