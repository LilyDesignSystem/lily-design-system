// emoji.test.js
// Emoji component test

const path = require("path");

describe("Emoji", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "emoji.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.emoji");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("emoji");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.emoji");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
