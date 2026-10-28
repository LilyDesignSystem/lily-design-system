// tel-input.test.js
// TelInput component test

const path = require("path");

describe("TelInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tel-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.tel-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tel-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.tel-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
