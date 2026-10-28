// listbox.test.js
// Listbox component test

const path = require("path");

describe("Listbox", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "listbox.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.listbox");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("listbox");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.listbox");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("listbox");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.listbox");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
