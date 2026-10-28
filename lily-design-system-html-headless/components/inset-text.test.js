// inset-text.test.js
// InsetText component test

const path = require("path");

describe("InsetText", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "inset-text.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.inset-text");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("inset-text");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.inset-text");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
