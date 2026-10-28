// combobox.test.js
// Combobox component test

const path = require("path");

describe("Combobox", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "combobox.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.combobox");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("combobox");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.combobox");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("combobox");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.combobox");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
