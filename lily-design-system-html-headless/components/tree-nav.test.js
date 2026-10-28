// tree-nav.test.js
// TreeNav component test

const path = require("path");

describe("TreeNav", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tree-nav.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.tree-nav");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tree-nav");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.tree-nav");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
