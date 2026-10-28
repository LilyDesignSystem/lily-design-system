// tour-list.test.js
// TourList component test

const path = require("path");

describe("TourList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tour-list.html"));
    });

    it("should render the ol element with correct class", async function () {
        const el = await $("ol.tour-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tour-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("ol.tour-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
