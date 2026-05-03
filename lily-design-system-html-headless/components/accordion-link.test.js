// accordion-link.test.js
// AccordionLink component test

const path = require("path");

describe("AccordionLink", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "accordion-link.html"),
    );
  });

  it("should render the a element with correct class", async function () {
    const el = await $("a.accordion-link");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("accordion-link");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("a.accordion-link");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
