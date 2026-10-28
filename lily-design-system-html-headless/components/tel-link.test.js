// tel-link.test.js
// TelLink component test

const path = require("path");

describe("TelLink", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tel-link.html"));
    });

    it("should render the a element with correct class", async function () {
        const el = await $("a.tel-link");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tel-link");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("a.tel-link");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
