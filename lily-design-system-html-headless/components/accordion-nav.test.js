// accordion-nav.test.js
// AccordionNav component test

const path = require("path");

describe("AccordionNav", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "accordion-nav.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.accordion-nav");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("accordion-nav");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.accordion-nav");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
