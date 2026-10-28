// tool-bar.test.js
// ToolBar component test

const path = require("path");

describe("ToolBar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tool-bar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tool-bar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tool-bar");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.tool-bar");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("toolbar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tool-bar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
