// panel.test.js
// Panel component test

const path = require("path");

describe("Panel", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "panel.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.panel");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("panel");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.panel");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("region");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.panel");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
