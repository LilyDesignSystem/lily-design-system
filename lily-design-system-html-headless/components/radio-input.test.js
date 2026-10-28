// radio-input.test.js
// RadioInput component test

const path = require("path");

describe("RadioInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "radio-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.radio-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("radio-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.radio-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
