// osterreich-sozialversicherungsnummer-view.test.js
// OsterreichSozialversicherungsnummerView component test

const path = require("path");

describe("OsterreichSozialversicherungsnummerView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "osterreich-sozialversicherungsnummer-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.osterreich-sozialversicherungsnummer-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("osterreich-sozialversicherungsnummer-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.osterreich-sozialversicherungsnummer-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
