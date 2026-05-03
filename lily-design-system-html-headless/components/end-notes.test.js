// end-notes.test.js
// EndNotes component test

const path = require("path");

describe("EndNotes", function () {
  beforeEach(async function () {
    await browser.url(
      "file://" + path.resolve(__dirname, "end-notes.html"),
    );
  });

  it("should render the section element with correct class", async function () {
    const el = await $("section.end-notes");
    await expect(el).toExist();
    const className = await el.getAttribute("class");
    expect(className).toContain("end-notes");
  });

  it("should have an aria-label attribute", async function () {
    const el = await $("section.end-notes");
    const label = await el.getAttribute("aria-label");
    expect(label).not.toBeNull();
  });
});
