// tour.test.js
// Tour component test

const path = require("path");

describe("Tour", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tour.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tour");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tour");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tour");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
