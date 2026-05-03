// person.test.js
// Person component test

const path = require("path");

describe("Person", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "person.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.person");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("person");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.person");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
