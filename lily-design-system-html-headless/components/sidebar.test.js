// sidebar.test.js
// Sidebar component test

const path = require("path");

describe("Sidebar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "sidebar.html"));
    });

    it("should render the aside element with correct class", async function () {
        const el = await $("aside.sidebar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("sidebar");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("aside.sidebar");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("complementary");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("aside.sidebar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
