// footer.test.js
// Footer component test

const path = require("path");

describe("Footer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "footer.html"));
    });

    it("should render the footer element with correct class", async function () {
        const el = await $("footer.footer");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("footer");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("footer.footer");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
