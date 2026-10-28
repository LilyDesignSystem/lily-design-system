// check-list-item.test.js
// CheckListItem component test

const path = require("path");

describe("CheckListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "check-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.check-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("check-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.check-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
