// hover-card.test.js
// HoverCard component test

const path = require("path");

describe("HoverCard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hover-card.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.hover-card");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hover-card");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.hover-card");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
