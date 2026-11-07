// error-summary.test.js
// ErrorSummary component test

const path = require("path");

describe("ErrorSummary", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "error-summary.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.error-summary");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("error-summary");
    });

    it("is named by its title", async function () {
        const el = await $("div.error-summary");
        const id = await el.getAttribute("aria-labelledby");
        expect(id).toBe("error-summary-title");
        await expect($("#" + id)).toExist();
    });
});
