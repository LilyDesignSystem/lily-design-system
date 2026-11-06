// summary-list.test.js
// SummaryList component test

const path = require("path");

describe("SummaryList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "summary-list.html"));
    });

    it("should render the dl element with correct class", async function () {
        const el = await $("dl.summary-list");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("summary-list");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("dl.summary-list");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
