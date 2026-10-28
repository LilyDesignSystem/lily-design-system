// tree-list.test.js
// TreeList component test

const path = require("path");

describe("TreeList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.tree-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tree-list");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("ol.tree-list");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("tree");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.tree-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
