// flair.test.js
// Flair component test

const path = require("path");

describe("Flair", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "flair.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.flair");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("flair");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.flair");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
