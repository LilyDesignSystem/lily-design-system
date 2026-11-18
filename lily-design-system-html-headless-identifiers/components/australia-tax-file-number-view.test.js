// australia-tax-file-number-view.test.js
// AustraliaTaxFileNumberView component test

const path = require("path");

describe("AustraliaTaxFileNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "australia-tax-file-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.australia-tax-file-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("australia-tax-file-number-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.australia-tax-file-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
