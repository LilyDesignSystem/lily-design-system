// information-callout.test.js
// InformationCallout component test

const path = require("path");

describe("InformationCallout", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "information-callout.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("aside.information-callout");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("information-callout");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("aside.information-callout");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
