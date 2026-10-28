// dont-list-item.test.js
// DontListItem component test

const path = require("path");

describe("DontListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "dont-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.dont-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("dont-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.dont-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
