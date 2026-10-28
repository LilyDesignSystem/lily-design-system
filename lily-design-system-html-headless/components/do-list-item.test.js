// do-list-item.test.js
// DoListItem component test

const path = require("path");

describe("DoListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "do-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.do-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("do-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.do-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
