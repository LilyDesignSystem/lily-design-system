// accordion-list.test.js
// AccordionList component test

const path = require("path");

describe("AccordionList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "accordion-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.accordion-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("accordion-list");
    });

    it("should keep native list semantics, with no explicit role", async function () {
        const el = await $("ol.accordion-list");
        expect(await el.getAttribute("role")).toBeNull();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.accordion-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
