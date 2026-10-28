// accordion-list-item.test.js
// AccordionListItem component test

const path = require("path");

describe("AccordionListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "accordion-list-item.html"));
    });

    it("should render the li element with correct class", async function () {
        const el = await $("li.accordion-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("accordion-list-item");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("li.accordion-list-item");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
