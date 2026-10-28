// popup.test.js
// Popup component test

const path = require("path");

describe("Popup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "popup.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.popup");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("popup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.popup");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
