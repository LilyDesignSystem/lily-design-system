// alert.test.js
// Alert component test

const path = require("path");

describe("Alert", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "alert.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.alert");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("alert");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.alert");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("alert");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.alert");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
