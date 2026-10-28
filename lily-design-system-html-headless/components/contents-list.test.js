// contents-list.test.js
// ContentsList component test

const path = require("path");

describe("ContentsList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "contents-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.contents-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("contents-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.contents-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
