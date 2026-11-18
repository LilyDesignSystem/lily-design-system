// rossiya-snils-view.test.js
// RossiyaSnilsView component test

const path = require("path");

describe("RossiyaSnilsView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "rossiya-snils-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.rossiya-snils-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("rossiya-snils-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.rossiya-snils-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
