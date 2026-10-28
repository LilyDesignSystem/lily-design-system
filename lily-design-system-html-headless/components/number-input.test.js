// number-input.test.js
// NumberInput component test

const path = require("path");

describe("NumberInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "number-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.number-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("number-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.number-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
