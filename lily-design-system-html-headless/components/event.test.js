// event.test.js
// Event component test

const path = require("path");

describe("Event", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "event.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.event");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("event");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.event");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
