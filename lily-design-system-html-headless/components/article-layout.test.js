// article-layout.test.js
// ArticleLayout component test

const path = require("path");

describe("ArticleLayout", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "article-layout.html"),
    );
  });

  it("should render the article element with correct class", async function () {
    const el = await $("article.article-layout");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("article-layout");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("article.article-layout");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
