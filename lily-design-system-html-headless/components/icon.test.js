// icon.test.js
// Icon component test

const path = require("path");

describe("Icon", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "icon.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.icon");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("icon");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.icon");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
