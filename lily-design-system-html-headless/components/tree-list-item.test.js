// tree-list-item.test.js
// TreeListItem component test

const path = require("path");

describe("TreeListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.tree-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tree-list-item");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("li.tree-list-item");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("treeitem");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.tree-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
