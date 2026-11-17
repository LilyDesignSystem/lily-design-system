// duration-view.test.js
// DurationView component test

const path = require("path");

describe("DurationView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "duration-view.html"));
    });

    it("should render the root element with correct class", async function () {
        const el = await $(".duration-view");
        await expect(el).toExist();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $(".duration-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
