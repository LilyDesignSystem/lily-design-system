// do-list.test.js
// DoList component test

const path = require("path");

describe("DoList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "do-list.html"));
    });

    it("should render the ul element with correct class", async function () {
        const el = await $("ul.do-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("do-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ul.do-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
