// hint.test.js
// Hint component test

const path = require("path");

describe("Hint", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hint.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("p.hint");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hint");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("p.hint");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
