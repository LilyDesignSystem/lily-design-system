// skip-link.test.js
// SkipLink component test

const path = require("path");

describe("SkipLink", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "skip-link.html"));
    });

    it("should render the a element with correct class", async function () {
        const el = await $("a.skip-link");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("skip-link");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("a.skip-link");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
