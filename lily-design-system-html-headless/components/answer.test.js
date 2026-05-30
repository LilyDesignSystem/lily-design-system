// answer.test.js
// Answer component test

const path = require("path");

describe("Answer", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "answer.html"),
    );
  });

  it("should render the div element with correct class", async function () {
    const el = await $("div.answer");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("answer");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("div.answer");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
