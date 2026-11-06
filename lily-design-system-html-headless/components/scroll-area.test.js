// scroll-area.test.js
// ScrollArea component test

const path = require("path");

describe("ScrollArea", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "scroll-area.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.scroll-area");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("scroll-area");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.scroll-area");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have role=region", async function () {
        const el = await $(".scroll-area");
        expect(await el.getAttribute("role")).toBe("region");
    });
});
