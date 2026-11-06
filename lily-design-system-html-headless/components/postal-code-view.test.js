// postal-code-view.test.js
// PostalCodeView component test

const path = require("path");

describe("PostalCodeView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "postal-code-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.postal-code-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("postal-code-view");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("span.postal-code-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
