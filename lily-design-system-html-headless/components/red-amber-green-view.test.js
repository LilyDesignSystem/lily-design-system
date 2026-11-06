// red-amber-green-view.test.js
// RedAmberGreenView component test

const path = require("path");

describe("RedAmberGreenView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "red-amber-green-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.red-amber-green-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-amber-green-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.red-amber-green-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
