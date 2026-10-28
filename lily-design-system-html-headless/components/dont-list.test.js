// dont-list.test.js
// DontList component test

const path = require("path");

describe("DontList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dont-list.html"));
    });

    it("should render the ul element with correct class", async function () {
        const el = await $("ul.dont-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dont-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ul.dont-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
