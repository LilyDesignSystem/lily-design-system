// submit-input.test.js
// SubmitInput component test

const path = require("path");

describe("SubmitInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "submit-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.submit-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("submit-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.submit-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
