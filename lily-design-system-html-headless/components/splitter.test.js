// splitter.test.js
// Splitter component test

const path = require("path");

describe("Splitter", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "splitter.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.splitter");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("splitter");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.splitter");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
