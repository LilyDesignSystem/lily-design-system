// search-input.test.js
// SearchInput component test

const path = require("path");

describe("SearchInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "search-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.search-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("search-input");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("input.search-input");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("searchbox");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.search-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
