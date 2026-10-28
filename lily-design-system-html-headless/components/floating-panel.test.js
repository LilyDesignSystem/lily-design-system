// floating-panel.test.js
// FloatingPanel component test

const path = require("path");

describe("FloatingPanel", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "floating-panel.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.floating-panel");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("floating-panel");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.floating-panel");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("region");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.floating-panel");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
