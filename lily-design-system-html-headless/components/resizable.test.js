// resizable.test.js
// Resizable component test

const path = require("path");

describe("Resizable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "resizable.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.resizable");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("resizable");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.resizable");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
