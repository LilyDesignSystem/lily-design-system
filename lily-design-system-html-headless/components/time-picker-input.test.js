// time-picker-input.test.js
// TimePickerInput component test

const path = require("path");

describe("TimePickerInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "time-picker-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.time-picker-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("time-picker-input");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("input.time-picker-input");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.time-picker-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
