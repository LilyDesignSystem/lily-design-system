// chat-message.test.js
// ChatMessage component test

const path = require("path");

describe("ChatMessage", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "chat-message.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.chat-message");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("chat-message");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.chat-message");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
