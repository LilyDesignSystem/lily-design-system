// contents-list-item.test.js
// ContentsListItem component test

const path = require("path");

describe("ContentsListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "contents-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.contents-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("contents-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.contents-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
