// back-link.test.js
// BackLink component test

const path = require("path");

describe("BackLink", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "back-link.html"));
    });

    it("should render the a element with correct class", async function () {
        const el = await $("a.back-link");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("back-link");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("a.back-link");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
