// badge.test.js
// Badge component test

const path = require("path");

describe("Badge", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "badge.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.badge");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("badge");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.badge");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have role=status", async function () {
        const el = await $(".badge");
        expect(await el.getAttribute("role")).toBe("status");
    });
});
