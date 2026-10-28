// toggle-group.test.js
// ToggleGroup component test

const path = require("path");

describe("ToggleGroup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "toggle-group.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.toggle-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("toggle-group");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.toggle-group");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("group");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.toggle-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
