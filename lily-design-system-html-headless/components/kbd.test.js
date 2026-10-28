// kbd.test.js
// Kbd component test

const path = require("path");

describe("Kbd", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "kbd.html"));
    });

    it("should render the kbd element with correct class", async function () {
        const el = await $("kbd.kbd");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("kbd");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("kbd.kbd");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
