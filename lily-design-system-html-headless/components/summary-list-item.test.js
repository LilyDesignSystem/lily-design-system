// summary-list-item.test.js
// SummaryListItem component test

const path = require("path");

describe("SummaryListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "summary-list-item.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.summary-list-item");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("summary-list-item");
    });

    it("should hold a dt and a dd", async function () {
        await expect($("div.summary-list-item > dt")).toExist();
        await expect($("div.summary-list-item > dd")).toExist();
    });

    it("should not name the generic div", async function () {
        const el = await $("div.summary-list-item");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
