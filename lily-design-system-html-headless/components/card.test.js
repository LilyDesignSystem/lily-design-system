// card.test.js
// Card component test

const path = require("path");

describe("Card", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "card.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.card");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("card");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.card");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("group");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.card");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
