// iban-view.test.js
// IbanView component test

const path = require("path");

describe("IbanView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "iban-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.iban-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("iban-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.iban-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
