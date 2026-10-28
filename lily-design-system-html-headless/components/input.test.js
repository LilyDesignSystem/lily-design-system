// input.test.js
// Input component test

const path = require("path");

describe("Input", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
