// caption.test.js
// Caption component test

const path = require("path");

describe("Caption", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "caption.html"));
    });

    it("should render the caption element with correct class", async function () {
        const el = await $("caption.caption");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("caption");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("caption.caption");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
