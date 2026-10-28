// text-input.test.js
// TextInput component test

const path = require("path");

describe("TextInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "text-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.text-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("text-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.text-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
