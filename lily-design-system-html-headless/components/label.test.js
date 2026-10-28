// label.test.js
// Label component test

const path = require("path");

describe("Label", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "label.html"));
    });

    it("should render the label element with correct class", async function () {
        const el = await $("label.label");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("label");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("label.label");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
