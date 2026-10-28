// check-list.test.js
// CheckList component test

const path = require("path");

describe("CheckList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "check-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.check-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("check-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.check-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
