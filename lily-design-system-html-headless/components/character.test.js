// character.test.js
// Character component test

const path = require("path");

describe("Character", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "character.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.character");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("character");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.character");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
