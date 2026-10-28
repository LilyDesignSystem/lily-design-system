// week-input.test.js
// WeekInput component test

const path = require("path");

describe("WeekInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "week-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.week-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("week-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.week-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
