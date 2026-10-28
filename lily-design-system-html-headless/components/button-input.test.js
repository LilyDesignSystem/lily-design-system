// button-input.test.js
// ButtonInput component test

const path = require("path");

describe("ButtonInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "button-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.button-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("button-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.button-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
