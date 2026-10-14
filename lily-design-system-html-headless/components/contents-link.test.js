// contents-link.test.js
// ContentsLink component test

const path = require("path");

describe("ContentsLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "contents-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.contents-link:first-of-type");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("contents-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.contents-link:first-of-type");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });

  it("should show a count inside the link, after the text", async function () {
    const count = await $("#with-count .contents-link-count");
    await expect(count).toExist();
    expect(await count.getText()).toBe("3 to do");
    expect(await (await $("#with-count")).getAttribute("data-count")).toBe("3");
  });

  it("should include the count in the link's accessible name (real accessibility tree)", async function () {
    const name = await (await $("#with-count")).getComputedLabel();
    expect(name).toContain("Address");
    expect(name).toContain("3 to do");
  });
});
